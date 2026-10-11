# The suggestion box

**Run once, in the Supabase SQL editor, in the `Syllabus Desk` project
(`gwwiaijfqovhizrmfxuk`, region `ca-central-1`).**

From v2.73, every page of UNI Made EZ has a **Suggest an idea** button, in the footer and on the home
page. A student picks what kind of note it is, writes it, and can add an email if they want a
reply. This is where those notes land. **Only the owner reads them**, in the Supabase dashboard.

Until this SQL is run nothing is lost and nothing breaks: the call returns 404, and the app
offers to open the student's own mail app with the note already written, addressed to
johnsonxcorp@outlook.com.

## What this stores, and what it deliberately does not

One row per note: **what kind it is, the words, an email only if the student typed one, the app
version, and the date.**

- **No device id.** Not even the random one the visitor counter uses. A note is read for what it
  says; tying it to a device would turn feedback into a record of someone's visits.
- **No name, no IP address, no user agent, no page history.** PostgREST does not store the
  caller's address in the table, and nothing in the function adds one.
- **The email is optional and is personal information.** It is held only to reply, and is
  covered by the same PIPA rights as a sign-up (access, correction, deletion within 30 days).

The table has **no read policy for the publishable key** — the key that ships in the page can
add a note and can never read one back, including its own. The owner panel inside the app shows
**counts only**, through a view that exposes nothing but numbers.

The function checks everything again in the database, so calling the API directly with the
publishable key gets the same limits as the form: 3 to 2,000 characters, a known kind, an email
that looks like one (or none), and a ceiling of 60 notes an hour across everyone, so a script
cannot fill the table.

```sql
-- ---------------------------------------------------------------------------
-- 1. the table.  No device id, no IP, no user agent.
-- ---------------------------------------------------------------------------
create table if not exists public.umez_suggestions (
  id          bigint generated always as identity primary key,
  kind        text not null check (kind in ('idea', 'course', 'bug', 'other')),
  body        text not null check (length(body) between 3 and 2000),
  email       text check (email is null or length(email) <= 120),
  app_version text,
  created_at  timestamptz not null default now(),
  status      text not null default 'new' check (status in ('new', 'read', 'planned', 'done', 'declined'))
);

alter table public.umez_suggestions enable row level security;
-- No policies at all: anon cannot insert, select, update or delete.  Everything arrives through
-- the SECURITY DEFINER function below, which is the only place the limits can be enforced.
revoke all on public.umez_suggestions from anon, authenticated;

create index if not exists umez_suggestions_created_idx on public.umez_suggestions (created_at desc);

-- ---------------------------------------------------------------------------
-- 2. the write path.
-- ---------------------------------------------------------------------------
create or replace function public.umez_suggest(p_kind text, p_body text, p_email text, p_ver text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  k text := lower(btrim(coalesce(p_kind, '')));
  b text := btrim(coalesce(p_body, ''));
  e text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  v text := left(btrim(coalesce(p_ver, '')), 12);
begin
  if k not in ('idea', 'course', 'bug', 'other') then return false; end if;
  if length(b) < 3 or length(b) > 2000 then return false; end if;
  if e is not null and (length(e) > 120 or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then return false; end if;
  -- a ceiling across everyone, so a loop with the public key cannot flood the table
  if (select count(*) from public.umez_suggestions where created_at > now() - interval '1 hour') >= 60 then
    return false;
  end if;
  insert into public.umez_suggestions (kind, body, email, app_version) values (k, b, e, nullif(v, ''));
  return true;
end;
$$;

revoke all on function public.umez_suggest(text, text, text, text) from public;
grant execute on function public.umez_suggest(text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. the owner panel's view.  Numbers only — no text, no emails.
-- ---------------------------------------------------------------------------
create or replace view public.umez_suggestion_stats
with (security_invoker = off) as
  select
    count(*)::bigint                                                         as total,
    count(*) filter (where created_at > now() - interval '7 days')::bigint  as last_7d,
    count(*) filter (where status = 'new')::bigint                           as unread,
    count(*) filter (where kind = 'idea')::bigint                            as ideas,
    count(*) filter (where kind = 'course')::bigint                          as courses,
    count(*) filter (where kind = 'bug')::bigint                             as bugs,
    count(*) filter (where kind = 'other')::bigint                           as other,
    max(created_at)                                                          as latest
  from public.umez_suggestions;

grant select on public.umez_suggestion_stats to anon, authenticated;
```

## Reading them

Supabase dashboard → **Table Editor → `umez_suggestions`**, newest first. Set `status` to `read`,
`planned`, `done` or `declined` as you go — the app's panel counts the `new` ones as unread.

Or in the SQL editor:

```sql
select created_at::date, kind, body, email
from public.umez_suggestions
where status = 'new'
order by created_at desc;
```

## Checking it worked

```sql
select public.umez_suggest('idea', 'A dark mode for the formula sheet', null, '2.73');   -- true
select public.umez_suggest('course', 'Please add ECON 2330', 'me@example.com', '2.73'); -- true
select public.umez_suggest('idea', 'x', null, '2.73');                                   -- false — too short
select public.umez_suggest('spam', 'hello there', null, '2.73');                         -- false — unknown kind
select public.umez_suggest('bug', 'it broke', 'not-an-email', '2.73');                   -- false — bad email
select * from public.umez_suggestion_stats;                                              -- total 2
delete from public.umez_suggestions where body in ('A dark mode for the formula sheet', 'Please add ECON 2330');
```

And with the **publishable** key, to prove the box can be written to but never read:

```sh
KEY=sb_publishable_...
URL=https://gwwiaijfqovhizrmfxuk.supabase.co
curl -s "$URL/rest/v1/umez_suggestion_stats?select=*" -H "apikey: $KEY" -H "authorization: Bearer $KEY"   # 200, numbers
curl -s "$URL/rest/v1/umez_suggestions?select=*"      -H "apikey: $KEY" -H "authorization: Bearer $KEY"   # 401, never rows
```

## Retention

Notes without an email hold no personal information and are kept while the app is published.
A note with an email is deleted within 30 days of a request, and the email may be cleared once
the reply is sent (`update public.umez_suggestions set email = null where id = …`).
