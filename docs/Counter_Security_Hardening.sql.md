# Database hardening — 14 September 2026

Applied to the `Syllabus Desk` Supabase project (`gwwiaijfqovhizrmfxuk`, `ca-central-1`), which
holds the UNI Made EZ counter, sign-ups and subject tally.

Two things were changed. The first was raised by Supabase's own linter. The second was found by
auditing the database while fixing the first, and matters more.

---

## 1. Two `SECURITY DEFINER` views

**What the linter said.** `public.umez_stats` and `public.umez_subject_tally` were flagged
**CRITICAL — Security Definer View**.

**Why it was right.** Both views are owned by `postgres` with `security_invoker` off, so a query
from `anon` ran the view body with the *owner's* rights and bypassed row-level security on
`umez_devices`, `umez_signups` and `umez_subjects`. That was deliberate — the whole purpose of
those views is to return counts without returning rows — but the elevated object was the wrong
shape. A view is an open surface: a caller appends `?select=` and filters of their own choosing,
and it is one careless edit to the view body away from exposing a column it should not.

**The fix: move the privilege, don't remove it.** The elevated rights now live in one small
`SECURITY DEFINER` *function* per dataset — fixed return shape, locked `search_path`, nothing a
caller can attach to it. This is the pattern `umez_ping` and `umez_subject` already used.

```
anon → view umez_stats             plain view, invoker rights, granted to anon
     → function umez_stats_read()  SECURITY DEFINER, search_path = public, STABLE
     → view umez_stats_v           the ORIGINAL aggregate, verbatim; invoker rights; granted to nobody
     → base tables
```

The original aggregate was **renamed, never retyped**. Retyping a thirty-line aggregate out of a
truncated results grid is how a silent arithmetic error gets into a figure nobody checks.

The public names and URLs are unchanged, so the app, the artifact, every copy already cached on a
student's phone and the 6pm scheduled task all kept working with no change on their side.

```sql
-- umez_stats
alter view public.umez_stats rename to umez_stats_v;
alter view public.umez_stats_v set (security_invoker = on);
revoke all on public.umez_stats_v from anon, authenticated, public;

create or replace function public.umez_stats_read()
returns setof public.umez_stats_v
language sql security definer stable set search_path = public
as $$ select * from public.umez_stats_v $$;

revoke all on function public.umez_stats_read() from public;
grant execute on function public.umez_stats_read() to anon, authenticated;

create view public.umez_stats with (security_invoker = on) as
  select * from public.umez_stats_read();
grant select on public.umez_stats to anon, authenticated;

-- umez_subject_tally: identical treatment
alter view public.umez_subject_tally rename to umez_subject_tally_v;
alter view public.umez_subject_tally_v set (security_invoker = on);
revoke all on public.umez_subject_tally_v from anon, authenticated, public;

create or replace function public.umez_subject_tally_read()
returns setof public.umez_subject_tally_v
language sql security definer stable set search_path = public
as $$ select * from public.umez_subject_tally_v $$;

revoke all on function public.umez_subject_tally_read() from public;
grant execute on function public.umez_subject_tally_read() to anon, authenticated;

create view public.umez_subject_tally with (security_invoker = on) as
  select * from public.umez_subject_tally_read();
grant select on public.umez_subject_tally to anon, authenticated;

notify pgrst, 'reload schema';
```

---

## 2. The one that mattered more: one lock where there should have been two

While checking the above, the privilege audit returned this:

| table | RLS on | anon SELECT | anon INSERT | anon UPDATE | anon DELETE |
|---|---|---|---|---|---|
| `umez_devices` | true | **true** | true | **true** | **true** |
| `umez_signups` | true | **true** | true | **true** | **true** |
| `umez_subjects` | true | false | false | false | false |

`umez_devices` and `umez_signups` granted `anon` — the role the publishable key in every copy of
the page acts as — full **SELECT, INSERT, UPDATE and DELETE** at the privilege level. Nothing
leaked, because row-level security was on and there was no SELECT policy. But that is **one
mechanism deep**: a single `alter table … disable row level security`, or one carelessly written
policy, and the key that ships in a public web page could have read, altered or deleted every row
— including the **names and email addresses** in `umez_signups`.

`umez_subjects`, built the same day, already had the right shape: no grants at all, so a read is
refused at the privilege level *before* RLS is consulted. That difference is visible from outside
— it answered `401` where the other two answered `200 []`, and that discrepancy is what exposed
the gap.

The privacy notice said the table holding names and emails "has no read permission for it at all".
That was true of the rows and not true of the grant. It is now true of both.

```sql
revoke select, update, delete, truncate, references, trigger
  on public.umez_devices from anon, authenticated;
revoke insert on public.umez_devices from anon, authenticated;   -- pings go via rpc/umez_ping

revoke select, update, delete, truncate, references, trigger
  on public.umez_signups from anon, authenticated;
grant insert on public.umez_signups to anon, authenticated;      -- the sign-up form POSTs here

notify pgrst, 'reload schema';
```

What the app actually needs, and now all it has:

- **`umez_devices`** — nothing. Every ping goes through `rpc/umez_ping`, which is
  `SECURITY DEFINER` and does not consult `anon`'s rights.
- **`umez_signups`** — `INSERT` only. The row-level policy `umez_signups_insert` decides whether a
  given write is allowed; the privilege grant no longer permits anything else.
- **`umez_subjects`** — nothing. Writes go through `rpc/umez_subject`.

---

## Verified afterwards, with the publishable key from the live `sync.json`

| Call | Result |
|---|---|
| `GET /umez_stats?select=*` | **200**, the figures |
| `GET /umez_subject_tally?select=*&order=students.desc` | **200**, the tally |
| `POST /rpc/umez_ping` | **204** |
| `POST /rpc/umez_subject` | **200** `true` |
| `POST /umez_signups` | **201** |
| `GET /umez_stats_v` · `GET /umez_subject_tally_v` | **401** permission denied for view |
| `GET /umez_devices` · `GET /umez_signups` · `GET /umez_subjects` | **401** permission denied |
| `DELETE /umez_signups?id=neq.zzz` | **401** |
| `PATCH /umez_signups?id=neq.zzz` | **401** |

Every read that should work, works. Every read, change and delete that should be impossible is
refused at the privilege level — tested by attempting it and being refused, not inferred from a
settings screen.

The rows this audit wrote (`POSTAUDIT1`, `POSTAUDIT1_x`, `Audit Probe`) were deleted afterwards.

---

## Still outstanding

- **Two `SETUPCHECK%` rows in `umez_devices` and two in `umez_signups`**, left over from
  configuring the counter. They inflate "devices ever" and "signed up" by two each. Deleting them
  needs one query and a click on Supabase's destructive-operation confirmation.
- **Rotate the publishable key.** It has been pasted into chat transcripts. Rotating it is a one
  line edit to `github/sync.json`; nothing else reads it, and the 6pm scheduled task fetches it
  from the live site each run rather than holding a copy.
- **A JohnsonXCorp email** to replace `johnsonandy242@gmail.com` as the published privacy contact
  in four board documents.
- Optional, for full consistency: move the sign-up write behind a `SECURITY DEFINER` function too,
  so `umez_signups` needs no grant at all. That is an app change as well as a database one, and
  the current `INSERT`-only grant plus an `INSERT`-only policy is a defensible resting place.

## Note on the other tables in this project

`syllabus_desk_devices` and `syllabus_desk_terms` belong to the Syllabus Desk app, which shares
this database. They show the same wide `anon` grants that `umez_devices` and `umez_signups` had.
They were **not** changed here — that is a different application, and changing its access rules
without testing its own read and write paths would be reckless. It is worth doing for that app,
deliberately, on its own.
