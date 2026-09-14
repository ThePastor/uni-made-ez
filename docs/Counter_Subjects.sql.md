# Subjects asked for — the "Other" tally

**Run once, in the Supabase SQL editor, in the `Syllabus Desk` project
(`gwwiaijfqovhizrmfxuk`, region `ca-central-1`).**

UNI Made EZ ships ten subject profiles. A student whose course is not one of them sets the
subject to **Other** and is asked one optional question: *what subject is this?* This is where
the answers land, and it is the queue that decides which profile gets written next.

Until this SQL is run, the app is not broken and nothing is lost: the call returns 404, the
app swallows it, and the student is told plainly that it could not be sent. The owner's
**Who's using UNI Made EZ** panel shows this file's name as the outstanding step.

## What this stores, and what it deliberately does not

One row per answer, holding **the subject name and the date, and nothing else.**

There is no device id in this table. That is the whole design, not an oversight: a tally of
subject names is the entire purpose, and knowing which device said `Nursing` would add nothing
to it while turning an aggregate into a record about a person. The price is that one student
who changes their mind twice is counted twice — the right side to be wrong on.

The label is filtered **in the database** as well as in the page, so the filter cannot be
bypassed by calling the API directly with the publishable key that ships in every copy of the
app. Letters, spaces, hyphens, apostrophes and ampersands; one to four words; 40 characters.
An email address, a URL, anything with a digit in it, or a sentence is discarded and the
function returns `false`.

Unlike `umez_devices` and `umez_signups`, the **aggregate view here is readable** by the
publishable key, because the owner's own panel inside the app shows the tally. That is safe
precisely because of the filter above: what a public key can read is a list of short subject
names with counts. The raw table stays unreadable — no `select` policy, ever.

```sql
-- ---------------------------------------------------------------------------
-- 1. the table.  No device id, no time of day, no IP, no user agent.
-- ---------------------------------------------------------------------------
create table if not exists public.umez_subjects (
  id         bigint generated always as identity primary key,
  label      text not null,
  said_on    date not null default (now() at time zone 'utc')::date
);

alter table public.umez_subjects enable row level security;

-- No policies at all.  anon cannot insert, cannot select, cannot do anything.
-- Everything reaches this table through the SECURITY DEFINER function below, which is the
-- only thing that can apply the filter and the only thing that gets to write.
-- (An earlier draft gave anon an INSERT policy.  That would have let anyone holding the
--  publishable key write unfiltered rows straight past the regex, which is the one thing
--  the filter exists to prevent.)

create index if not exists umez_subjects_label_idx on public.umez_subjects (lower(label));

-- ---------------------------------------------------------------------------
-- 2. the write path.  SECURITY DEFINER, so the table needs no anon policy at all.
-- ---------------------------------------------------------------------------
create or replace function public.umez_subject(p_label text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v text := btrim(regexp_replace(coalesce(p_label, ''), '\s+', ' ', 'g'));
begin
  -- 40 characters, letters and a short list of punctuation, four words at most.
  if v = '' or length(v) > 40 then return false; end if;
  if v !~ '^[[:alpha:]][[:alpha:][:space:]''’&-]*$' then return false; end if;
  if array_length(string_to_array(v, ' '), 1) > 4 then return false; end if;

  -- One row per answer.  Case and spacing are normalised at read time, not here, so the
  -- owner sees the words students actually typed.
  insert into public.umez_subjects (label) values (v);
  return true;
end;
$$;

revoke all on function public.umez_subject(text) from public;
grant execute on function public.umez_subject(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. the read path.  An aggregate, and only an aggregate.
--    security_invoker = off so the view reads the table the owner's way; what it EXPOSES is
--    a count per name, which is what the app's owner panel and the 6pm list both read.
-- ---------------------------------------------------------------------------
create or replace view public.umez_subject_tally
with (security_invoker = off) as
  select
    min(label)                        as label,
    count(*)::bigint                  as students,
    min(said_on)                      as first_seen,
    max(said_on)                      as last_seen,
    count(*) filter (where said_on >= (now() at time zone 'utc')::date - 7)::bigint as students_7d,
    count(*) filter (where said_on  = (now() at time zone 'utc')::date)::bigint     as students_1d
  from public.umez_subjects
  group by lower(label);

grant select on public.umez_subject_tally to anon, authenticated;
revoke all on public.umez_subjects from anon, authenticated;
```

## Checking it worked

In the SQL editor:

```sql
select public.umez_subject('Nursing');          -- true
select public.umez_subject('nursing');          -- true  (folds into the same tally row)
select public.umez_subject('me@example.com');   -- false — an @ sign
select public.umez_subject('PHYS 1100');        -- false — digits
select public.umez_subject('this app is bad and here is why in detail'); -- false — too many words
select * from public.umez_subject_tally;        -- Nursing · 2
```

Then remove the test rows — this one is safe to run, it touches nothing a student wrote:

```sql
delete from public.umez_subjects where lower(label) = 'nursing';
```

And from a terminal, with the **publishable** key, to prove the read path works and the raw
table is still shut:

```sh
KEY=sb_publishable_...
URL=https://gwwiaijfqovhizrmfxuk.supabase.co

# the tally: 200, a JSON array
curl -s "$URL/rest/v1/umez_subject_tally?select=*" -H "apikey: $KEY" -H "authorization: Bearer $KEY"

# the raw table: must be 401 or an empty array, never rows
curl -s "$URL/rest/v1/umez_subjects?select=*" -H "apikey: $KEY" -H "authorization: Bearer $KEY"
```

## Where it appears

- **In the app** — owner menu → *Who's using UNI Made EZ* → **Subjects asked for**.
- **Daily at 6pm Kamloops time** — a scheduled task reads `umez_subject_tally` with the
  publishable key and sends the list. It holds no secret key, because it does not need one.

## Retention

Rows are kept while the app is published and are deleted when it is retired. They hold no
personal information, so there is nothing to action a deletion request against — which is
itself the reason the table was built this way.
