-- =====================================================================================
-- Stormtoren · database voor accounts, profielen, winkel, opdrachten, wins en ranglijst
-- Plak dit hele bestand één keer in Supabase → SQL Editor → Run.
-- Het is veilig om het opnieuw te draaien (bijv. na een update): bestaande spelers blijven staan.
--
-- Beveiliging: spelers mogen hun profiel alleen LEZEN. Alles wat iets verandert (munten, wins,
-- skins…) loopt via de functies hieronder, die op de server rekenen en controleren.
-- =====================================================================================

-- ---------- skins (catalogus: wins nodig + prijs) ----------
create table if not exists public.items (
  id text primary key,
  cat text not null check (cat in ('blocks', 'world', 'fx', 'avatar', 'namecol', 'frame')),
  wins int not null default 0,
  price int not null default 0,
  is_default boolean not null default false
);
-- blokken = steensoorten, wereld = lucht-sfeer van het schilderij, fx = landingseffect (zelfde lijst als ITEMS in index.html)
insert into public.items (id, cat, wins, price, is_default) values
  ('b_rock', 'blocks', 0, 0, true), ('b_moss', 'blocks', 0, 200, false), ('b_sand', 'blocks', 1, 300, false), ('b_marble', 'blocks', 3, 450, false),
  ('b_ice', 'blocks', 5, 550, false), ('b_crystal', 'blocks', 10, 750, false), ('b_lava', 'blocks', 15, 1000, false), ('b_gold', 'blocks', 25, 1200, false),
  ('w_golden', 'world', 0, 0, true), ('w_dawn', 'world', 0, 300, false), ('w_autumn', 'world', 2, 500, false),
  ('w_storm', 'world', 5, 750, false), ('w_night', 'world', 10, 900, false),
  ('f_dust', 'fx', 0, 0, true), ('f_gravel', 'fx', 0, 200, false), ('f_leaves', 'fx', 1, 300, false), ('f_flies', 'fx', 3, 450, false),
  ('f_stars', 'fx', 5, 500, false), ('f_confetti', 'fx', 8, 600, false),
  ('a_happy', 'avatar', 0, 0, true), ('a_wink', 'avatar', 0, 0, true), ('a_cool', 'avatar', 0, 100, false), ('a_wow', 'avatar', 0, 150, false),
  ('a_grr', 'avatar', 1, 200, false), ('a_sleepy', 'avatar', 2, 200, false), ('a_star', 'avatar', 4, 350, false), ('a_king', 'avatar', 15, 1000, false),
  ('n_white', 'namecol', 0, 0, true), ('n_sky', 'namecol', 0, 100, false), ('n_mint', 'namecol', 0, 100, false), ('n_pink', 'namecol', 0, 100, false),
  ('n_gold', 'namecol', 10, 600, false), ('n_rainbow', 'namecol', 20, 1200, false),
  ('r_none', 'frame', 0, 0, true), ('r_bronze', 'frame', 1, 250, false), ('r_silver', 'frame', 5, 500, false), ('r_gold', 'frame', 12, 900, false), ('r_rainbow', 'frame', 25, 1500, false)
on conflict (id) do update set cat = excluded.cat, wins = excluded.wins, price = excluded.price, is_default = excluded.is_default;

-- oude skins (van vóór de schilderij-winkel) omzetten naar de nieuwe skin op dezelfde plek; daarna de oude uit de catalogus.
-- Veilig om opnieuw te draaien: staat er niets ouds meer, dan verandert er niets.
do $$
declare m jsonb := '{"b_classic":"b_rock","b_pastel":"b_moss","b_ocean":"b_sand","b_candy":"b_marble","b_wood":"b_ice","b_neon":"b_crystal",
  "w_sunny":"w_golden","w_sunset":"w_dawn","w_desert":"w_autumn","w_snow":"w_storm","f_puff":"f_dust","f_hearts":"f_leaves","f_sparks":"f_flies"}';
begin
  if to_regclass('public.profiles') is not null then
    update public.profiles p set
      owned = (select coalesce(array_agg(distinct coalesce(m ->> o, o)), '{}') from unnest(p.owned) as o),
      eq = (select jsonb_object_agg(e.key, coalesce(to_jsonb(m ->> (e.value #>> '{}')), e.value)) from jsonb_each(p.eq) as e)
    where p.owned && (select array_agg(k) from jsonb_object_keys(m) as k)
       or exists (select 1 from jsonb_each_text(p.eq) as e where m ? e.value);
  end if;
  delete from public.items where id in (select jsonb_object_keys(m));
end $$;
alter table public.items enable row level security;
drop policy if exists "skins zijn openbaar" on public.items;
create policy "skins zijn openbaar" on public.items for select using (true);

-- ---------- profielen ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,16}$'),
  name text not null check (char_length(name) between 1 and 14),
  coins int not null default 0 check (coins >= 0),
  xp int not null default 0,
  level int not null default 1,
  wins int not null default 0,
  owned text[] not null default '{}',
  eq jsonb not null default '{"blocks":"b_rock","world":"w_golden","fx":"f_dust","avatar":"a_happy","namecol":"n_white","frame":"r_none"}',
  stats jsonb not null default '{}',     -- games, puzzle, race, survival, party, blocks, perfects, bestStreak, bestPuzzle, bestSurvival, bestRace, raceGold
  ach jsonb not null default '{}',       -- prestatie-id → tijdstip
  daily jsonb not null default '{"last":"","streak":0}',
  quests jsonb not null default '{"date":"","list":[]}',
  today jsonb not null default '{}',     -- tellers van vandaag (voor de opdrachten)
  last_game timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "eigen profiel lezen" on public.profiles;
create policy "eigen profiel lezen" on public.profiles for select using (auth.uid() = id);
-- bewust GEEN insert/update/delete-regels: veranderen kan alleen via de functies hieronder

-- ---------- party-uitslagen (voor eerlijke wins) ----------
create table if not exists public.party_reports (
  code text not null,
  seed bigint not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  score int not null,
  claimed boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (code, seed, user_id)
);
alter table public.party_reports enable row level security;   -- geen regels: niemand leest of schrijft hier direct

-- =====================================================================================
-- hulpfuncties
-- =====================================================================================
create or replace function public._today() returns text language sql stable as $$
  select to_char((now() at time zone 'Europe/Amsterdam')::date, 'YYYY-MM-DD')
$$;
create or replace function public._num(j jsonb, k text) returns numeric language sql immutable as $$
  select coalesce((j ->> k)::numeric, 0)
$$;
create or replace function public._xp_need(l int) returns int language sql immutable as $$
  select round(60 + 40 * l + 6 * l * l)::int
$$;

-- profiel zoals het spel het verwacht
create or replace function public._profile_json(p public.profiles) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'cloud', true, 'username', p.username, 'name', p.name, 'xp', p.xp, 'level', p.level, 'coins', p.coins,
    'owned', to_jsonb(p.owned), 'eq', p.eq,
    'stats', p.stats || jsonb_build_object('partyWins', p.wins),
    'ach', p.ach, 'daily', p.daily,
    'quests', jsonb_build_object('date', p.quests ->> 'date', 'list', coalesce((
      select jsonb_agg(q || jsonb_build_object('prog', case when p.today ->> 'date' = p.quests ->> 'date' then public._num(p.today, q ->> 'k') else 0 end) order by i)
      from jsonb_array_elements(p.quests -> 'list') with ordinality as t(q, i)), '[]'::jsonb))
  )
$$;

-- nieuwe dag: tellers op nul en 3 nieuwe opdrachten
create or replace function public._ensure_day(uid uuid) returns void language plpgsql security definer set search_path = public as $$
declare
  t text := _today(); p profiles; pool jsonb := '[
    {"k":"games_puzzle","n":[2,3]}, {"k":"games_race","n":[2,3]}, {"k":"games_survival","n":[2,3]},
    {"k":"blocks","n":[30,45,60]}, {"k":"perfects","n":[8,12,16]}, {"k":"puzzleScore","n":[6,8,10]},
    {"k":"survivalH","n":[8,10,14]}, {"k":"raceMedal","n":[1]}, {"k":"party","n":[1,2]}]';
  picked jsonb := '[]'; q jsonb; ni int; idx int := 0;
begin
  select * into p from profiles where id = uid for update;
  if p.today ->> 'date' is distinct from t then
    update profiles set today = jsonb_build_object('date', t) where id = uid;
  end if;
  if p.quests ->> 'date' is distinct from t then
    for q in select value from jsonb_array_elements(pool) order by random() limit 3 loop
      ni := floor(random() * jsonb_array_length(q -> 'n'))::int;
      picked := picked || jsonb_build_object('k', q ->> 'k', 'n', (q -> 'n' ->> ni)::int, 'claimed', false,
        'coins', 60 + ni * 20 + idx * 10, 'xp', 30 + ni * 10);
      idx := idx + 1;
    end loop;
    update profiles set quests = jsonb_build_object('date', t, 'list', picked) where id = uid;
  end if;
end $$;

-- XP erbij, met level-ups (elk level geeft munten); geeft de level-ups terug
create or replace function public._add_xp(uid uuid, n int) returns jsonb language plpgsql security definer set search_path = public as $$
declare p profiles; ups jsonb := '[]'; c int;
begin
  select * into p from profiles where id = uid for update;
  p.xp := p.xp + greatest(n, 0);
  while p.xp >= _xp_need(p.level) loop
    p.xp := p.xp - _xp_need(p.level); p.level := p.level + 1;
    c := 40 + 10 * p.level; p.coins := p.coins + c;
    ups := ups || jsonb_build_object('level', p.level, 'coins', c);
  end loop;
  update profiles set xp = p.xp, level = p.level, coins = p.coins where id = uid;
  return ups;
end $$;

-- prestaties controleren; geeft de nieuwe terug
create or replace function public._check_ach(uid uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare p profiles; s jsonb; got jsonb := '[]'; a record; ok boolean; extra int := 0;
begin
  select * into p from profiles where id = uid for update;
  s := p.stats;
  for a in select * from (values
    ('first', 50), ('games10', 100), ('games50', 250), ('blocks500', 150), ('puz10', 100), ('puz15', 200), ('surv10', 100), ('surv25', 200),
    ('gold', 150), ('streak5', 100), ('party1', 75), ('partyWin', 150), ('lvl10', 200), ('wins10', 300), ('items8', 150)) as v(id, coins)
  loop
    continue when p.ach ? a.id;
    ok := case a.id
      when 'first' then _num(s, 'games') >= 1 when 'games10' then _num(s, 'games') >= 10 when 'games50' then _num(s, 'games') >= 50
      when 'blocks500' then _num(s, 'blocks') >= 500 when 'puz10' then _num(s, 'bestPuzzle') >= 10 when 'puz15' then _num(s, 'bestPuzzle') >= 15
      when 'surv10' then _num(s, 'bestSurvival') >= 10 when 'surv25' then _num(s, 'bestSurvival') >= 25 when 'gold' then _num(s, 'raceGold') >= 1
      when 'streak5' then _num(s, 'bestStreak') >= 5 when 'party1' then _num(s, 'party') >= 1 when 'partyWin' then p.wins >= 1
      when 'lvl10' then p.level >= 10 when 'wins10' then p.wins >= 10
      when 'items8' then (select count(*) from items i where i.id = any (p.owned) and not i.is_default) >= 8
      else false end;
    if ok then
      p.ach := p.ach || jsonb_build_object(a.id, (extract(epoch from now()) * 1000)::bigint);
      extra := extra + a.coins; got := got || jsonb_build_object('id', a.id, 'coins', a.coins);
    end if;
  end loop;
  if extra > 0 then update profiles set ach = p.ach, coins = coins + extra where id = uid; end if;
  return got;
end $$;

-- tellers van vandaag bijwerken (som of maximum)
create or replace function public._today_add(uid uuid, k text, v numeric, as_max boolean default false) returns void language sql security definer set search_path = public as $$
  update profiles set today = jsonb_set(today, array[k],
    to_jsonb(case when as_max then greatest(_num(today, k), v) else _num(today, k) + v end)) where id = uid
$$;

-- =====================================================================================
-- functies die het spel aanroept
-- =====================================================================================

-- account afmaken na het registreren; neemt (begrensd) wat munten, level en gratis skins mee uit het gastprofiel
create or replace function public.create_profile(p_username text, p_import jsonb default '{}') returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p profiles; u text := lower(trim(p_username)); own text[]; e jsonb; k text; nm text;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  select * into p from profiles where id = uid;
  if found then perform _ensure_day(uid); select * into p from profiles where id = uid; return _profile_json(p); end if;
  if u !~ '^[a-z0-9_]{3,16}$' then raise exception 'ongeldige gebruikersnaam'; end if;
  -- gratis skins (0 wins) uit het gastprofiel, plus de standaard-skins
  select array_agg(id) into own from items where is_default
    or (wins = 0 and id in (select jsonb_array_elements_text(coalesce(p_import -> 'owned', '[]'))));
  e := '{"blocks":"b_rock","world":"w_golden","fx":"f_dust","avatar":"a_happy","namecol":"n_white","frame":"r_none"}';
  for k in select jsonb_object_keys(e) loop
    if (p_import -> 'eq' ->> k) = any (own) and exists (select 1 from items where id = p_import -> 'eq' ->> k and cat = k) then
      e := jsonb_set(e, array[k], to_jsonb(p_import -> 'eq' ->> k));
    end if;
  end loop;
  nm := left(regexp_replace(coalesce(nullif(trim(p_import ->> 'name'), ''), u), '[<>&"]', '', 'g'), 14);
  if nm = '' then nm := u; end if;
  insert into profiles (id, username, name, coins, level, owned, eq)
  values (uid, u, nm,
    least(greatest(coalesce((p_import ->> 'coins')::int, 0), 0), 1500),
    least(greatest(coalesce((p_import ->> 'level')::int, 1), 1), 10),
    own, e);
  perform _ensure_day(uid);
  select * into p from profiles where id = uid;
  return _profile_json(p);
exception when unique_violation then raise exception 'gebruikersnaam bezet';
end $$;

create or replace function public.get_profile() returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p profiles;
begin
  if uid is null then return null; end if;
  if not exists (select 1 from profiles where id = uid) then return null; end if;
  perform _ensure_day(uid);
  select * into p from profiles where id = uid;
  return _profile_json(p);
end $$;

-- solo-potje afronden: de server rekent de beloning uit (met grenzen, zodat onzin-scores niets opleveren)
create or replace function public.finish_game(p jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid(); r profiles; m text := p ->> 'mode';
  placed int := least(greatest(coalesce((p ->> 'placed')::int, 0), 0), 300);
  perfects int; score int; height numeric; t numeric; streak int; medal text := null;
  v_xp int := 0; v_coins int := 0; rec boolean := false; before jsonb; ups jsonb; achs jsonb; s jsonb;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  perform _ensure_day(uid);
  select * into r from profiles where id = uid for update;
  if not found then raise exception 'geen profiel'; end if;
  if m not in ('puzzle', 'race', 'survival') then raise exception 'onbekende modus'; end if;
  if r.last_game is not null and r.last_game > now() - interval '8 seconds' then raise exception 'te snel'; end if;
  perfects := least(greatest(coalesce((p ->> 'perfects')::int, 0), 0), placed);
  streak := least(greatest(coalesce((p ->> 'streak')::int, 0), 0), perfects);
  score := least(greatest(coalesce((p ->> 'score')::int, 0), 0), least(placed, 40));
  height := least(greatest(coalesce((p ->> 'height')::numeric, 0), 0), least(placed * 2 + 1, 150));
  t := coalesce((p ->> 'time')::numeric, 0);
  before := jsonb_build_object('level', r.level, 'xp', r.xp, 'need', _xp_need(r.level));
  s := r.stats;
  s := jsonb_set(s, '{games}', to_jsonb(_num(s, 'games') + 1));
  s := jsonb_set(s, array[m], to_jsonb(_num(s, m) + 1));
  s := jsonb_set(s, '{blocks}', to_jsonb(_num(s, 'blocks') + placed));
  s := jsonb_set(s, '{perfects}', to_jsonb(_num(s, 'perfects') + perfects));
  s := jsonb_set(s, '{bestStreak}', to_jsonb(greatest(_num(s, 'bestStreak'), streak)));
  if m = 'puzzle' then
    v_xp := 20 + 6 * score; v_coins := 5 + 2 * score; rec := score > _num(s, 'bestPuzzle');
    s := jsonb_set(s, '{bestPuzzle}', to_jsonb(greatest(_num(s, 'bestPuzzle'), score)));
    perform _today_add(uid, 'puzzleScore', score, true);
  elsif m = 'race' then
    if t >= 20 and placed >= 6 then   -- alleen een geldige finish telt
      medal := case when t <= 75 then 'gold' when t <= 110 then 'silver' when t <= 160 then 'bronze' end;
      rec := _num(s, 'bestRace') = 0 or t < _num(s, 'bestRace');
      if rec then s := jsonb_set(s, '{bestRace}', to_jsonb(round(t, 2))); end if;
      if medal = 'gold' then s := jsonb_set(s, '{raceGold}', to_jsonb(_num(s, 'raceGold') + 1)); end if;
      if medal is not null then perform _today_add(uid, 'raceMedal', 1, true); end if;
    end if;
    v_xp := 25 + coalesce(case medal when 'gold' then 40 when 'silver' then 25 when 'bronze' then 12 end, 0) + placed;
    v_coins := 8 + coalesce(case medal when 'gold' then 20 when 'silver' then 13 when 'bronze' then 6 end, 0);
  else
    v_xp := 15 + round(4 * height)::int + perfects; v_coins := 4 + floor(height)::int; rec := height > _num(s, 'bestSurvival');
    s := jsonb_set(s, '{bestSurvival}', to_jsonb(greatest(_num(s, 'bestSurvival'), round(height, 1))));
    perform _today_add(uid, 'survivalH', floor(height), true);
  end if;
  if rec then v_xp := v_xp + 20; end if;
  update profiles set stats = s, coins = profiles.coins + v_coins, last_game = now() where id = uid;
  perform _today_add(uid, 'games_' || m, 1);
  perform _today_add(uid, 'blocks', placed);
  perform _today_add(uid, 'perfects', perfects);
  ups := _add_xp(uid, v_xp);
  achs := _check_ach(uid);
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r), 'reward', jsonb_build_object('xp', v_xp, 'coins', v_coins, 'before', before, 'ups', ups, 'achs', achs, 'record', rec, 'medal', medal));
end $$;

-- party-potje afronden: beloning voor meedoen + je score insturen (de win komt via claim_party_win)
create or replace function public.finish_party(p_code text, p_seed bigint, p jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid(); r profiles; placed int := least(greatest(coalesce((p ->> 'placed')::int, 0), 0), 300);
  perfects int; score int; streak int; v_xp int; v_coins int; before jsonb; ups jsonb; achs jsonb; s jsonb;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  if p_code !~ '^[a-z0-9]{5}$' then raise exception 'ongeldige party'; end if;
  perform _ensure_day(uid);
  select * into r from profiles where id = uid for update;
  if not found then raise exception 'geen profiel'; end if;
  if exists (select 1 from party_reports where code = p_code and seed = p_seed and user_id = uid) then raise exception 'al ingestuurd'; end if;
  if r.last_game is not null and r.last_game > now() - interval '8 seconds' then raise exception 'te snel'; end if;
  perfects := least(greatest(coalesce((p ->> 'perfects')::int, 0), 0), placed);
  streak := least(greatest(coalesce((p ->> 'streak')::int, 0), 0), perfects);
  score := least(greatest(coalesce((p ->> 'score')::int, 0), 0), least(placed, 40));
  insert into party_reports (code, seed, user_id, score) values (p_code, p_seed, uid, score);
  before := jsonb_build_object('level', r.level, 'xp', r.xp, 'need', _xp_need(r.level));
  s := r.stats;
  s := jsonb_set(s, '{games}', to_jsonb(_num(s, 'games') + 1));
  s := jsonb_set(s, '{puzzle}', to_jsonb(_num(s, 'puzzle') + 1));
  s := jsonb_set(s, '{party}', to_jsonb(_num(s, 'party') + 1));
  s := jsonb_set(s, '{blocks}', to_jsonb(_num(s, 'blocks') + placed));
  s := jsonb_set(s, '{perfects}', to_jsonb(_num(s, 'perfects') + perfects));
  s := jsonb_set(s, '{bestStreak}', to_jsonb(greatest(_num(s, 'bestStreak'), streak)));
  s := jsonb_set(s, '{bestPuzzle}', to_jsonb(greatest(_num(s, 'bestPuzzle'), score)));
  v_xp := 20 + 6 * score + 25; v_coins := 5 + 2 * score + 5;
  update profiles set stats = s, coins = profiles.coins + v_coins, last_game = now() where id = uid;
  perform _today_add(uid, 'games_puzzle', 1);
  perform _today_add(uid, 'party', 1);
  perform _today_add(uid, 'blocks', placed);
  perform _today_add(uid, 'perfects', perfects);
  perform _today_add(uid, 'puzzleScore', score, true);
  ups := _add_xp(uid, v_xp);
  achs := _check_ach(uid);
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r), 'reward', jsonb_build_object('xp', v_xp, 'coins', v_coins, 'before', before, 'ups', ups, 'achs', achs));
end $$;

-- win ophalen: telt alleen als minstens 2 spelers met een account hun score hebben ingestuurd
-- en jij (gedeeld) de hoogste hebt. Eén keer per potje.
create or replace function public.claim_party_win(p_code text, p_seed bigint) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); mine party_reports; n int; top int; w0 int; r profiles; unl jsonb; ups jsonb; achs jsonb;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  select * into mine from party_reports where code = p_code and seed = p_seed and user_id = uid for update;
  if not found then raise exception 'geen uitslag'; end if;
  if mine.claimed then return jsonb_build_object('status', 'done'); end if;
  select count(*), max(score) into n, top from party_reports where code = p_code and seed = p_seed and created_at > now() - interval '15 minutes';
  if n < 2 then return jsonb_build_object('status', 'pending', 'players', n); end if;
  update party_reports set claimed = true where code = p_code and seed = p_seed and user_id = uid;
  if mine.score < top then return jsonb_build_object('status', 'lost'); end if;
  select wins into w0 from profiles where id = uid for update;
  update profiles set wins = wins + 1, coins = coins + 30 where id = uid;
  ups := _add_xp(uid, 50);
  achs := _check_ach(uid);
  select coalesce(jsonb_agg(id), '[]') into unl from items where price > 0 and wins > w0 and wins <= w0 + 1;
  select * into r from profiles where id = uid;
  return jsonb_build_object('status', 'win', 'profile', _profile_json(r), 'unlocked', unl, 'ups', ups, 'achs', achs);
end $$;

-- skin kopen: genoeg wins én genoeg munten
-- uitgelicht: elke dag (Nederlandse tijd) één blok-, lucht- of effect-skin, 30% korting en zonder wins.
-- Zelfde keuze als featuredItem() in index.html: alfabetisch op id, dag-nummer sinds 1 jan 2026, modulo het aantal.
create or replace function public.featured_item() returns text language sql stable set search_path = public as $$
  with pool as (select id, row_number() over (order by id collate "C") - 1 as n, count(*) over () as c
                from items where price > 0 and cat in ('blocks', 'world', 'fx'))
  select id from pool where n = (((_today()::date - date '2026-01-01') % c) + c) % c
$$;

create or replace function public.buy_item(p_id text) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); it items; r profiles; achs jsonb; feat boolean; cost int;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  select * into it from items where id = p_id;
  if not found then raise exception 'onbekende skin'; end if;
  select * into r from profiles where id = uid for update;
  if p_id = any (r.owned) then raise exception 'al gekocht'; end if;
  feat := p_id = featured_item();
  cost := case when feat then (round(it.price * 0.7 / 5) * 5)::int else it.price end;
  if r.wins < it.wins and not feat then raise exception 'te weinig wins'; end if;
  if r.coins < cost then raise exception 'te weinig munten'; end if;
  update profiles set coins = coins - cost, owned = array_append(owned, p_id), eq = jsonb_set(eq, array[it.cat], to_jsonb(p_id)) where id = uid;
  achs := _check_ach(uid);
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r), 'achs', achs);
end $$;

-- skin kiezen (alleen wat je bezit)
create or replace function public.equip_item(p_id text) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); it items; r profiles;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  select * into it from items where id = p_id;
  if not found then raise exception 'onbekende skin'; end if;
  select * into r from profiles where id = uid for update;
  if not (p_id = any (r.owned)) then raise exception 'niet in bezit'; end if;
  update profiles set eq = jsonb_set(eq, array[it.cat], to_jsonb(p_id)) where id = uid;
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r));
end $$;

-- dagelijkse beloning (reeks van 7 dagen)
create or replace function public.claim_daily() returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r profiles; t text := _today(); y text; d int; amt int;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  select * into r from profiles where id = uid for update;
  if r.daily ->> 'last' = t then raise exception 'al opgehaald'; end if;
  y := to_char((now() at time zone 'Europe/Amsterdam')::date - 1, 'YYYY-MM-DD');
  d := case when r.daily ->> 'last' = y then (coalesce((r.daily ->> 'streak')::int, 0) % 7) + 1 else 1 end;
  amt := (array[50, 75, 100, 125, 150, 200, 300])[d];
  update profiles set daily = jsonb_build_object('last', t, 'streak', d), coins = coins + amt where id = uid;
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r), 'amount', amt);
end $$;

-- opdracht ophalen: de server kijkt zelf of je hem echt gehaald hebt
create or replace function public.claim_quest(p_idx int) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r profiles; q jsonb; ups jsonb;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  perform _ensure_day(uid);
  select * into r from profiles where id = uid for update;
  q := r.quests -> 'list' -> p_idx;
  if q is null then raise exception 'onbekende opdracht'; end if;
  if (q ->> 'claimed')::boolean then raise exception 'al opgehaald'; end if;
  if _num(r.today, q ->> 'k') < (q ->> 'n')::int then raise exception 'nog niet klaar'; end if;
  update profiles set quests = jsonb_set(quests, array['list', p_idx::text, 'claimed'], 'true'), coins = coins + (q ->> 'coins')::int where id = uid;
  ups := _add_xp(uid, (q ->> 'xp')::int);
  perform _check_ach(uid);
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r), 'ups', ups);
end $$;

-- weergavenaam aanpassen (je gebruikersnaam om in te loggen blijft hetzelfde)
create or replace function public.set_name(p_name text) returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); nm text := left(regexp_replace(trim(coalesce(p_name, '')), '[<>&"]', '', 'g'), 14); r profiles;
begin
  if uid is null then raise exception 'niet ingelogd'; end if;
  if nm = '' then raise exception 'lege naam'; end if;
  update profiles set name = nm where id = uid;
  select * into r from profiles where id = uid;
  return jsonb_build_object('profile', _profile_json(r));
end $$;

-- ranglijst (openbaar): top 20 per categorie
create or replace function public.leaderboard(p_mode text) returns table (name text, value numeric, avatar text, frame text, namecol text, me boolean)
language sql stable security definer set search_path = public as $$
  select p.name,
    case p_mode when 'puzzle' then _num(p.stats, 'bestPuzzle') when 'survival' then _num(p.stats, 'bestSurvival')
                when 'race' then _num(p.stats, 'bestRace') else p.wins end as value,
    p.eq ->> 'avatar', p.eq ->> 'frame', p.eq ->> 'namecol', p.id = auth.uid()
  from profiles p
  where case p_mode when 'puzzle' then _num(p.stats, 'bestPuzzle') when 'survival' then _num(p.stats, 'bestSurvival')
                    when 'race' then _num(p.stats, 'bestRace') else p.wins end > 0
  order by case when p_mode = 'race' then _num(p.stats, 'bestRace') end asc nulls last,
           case when p_mode <> 'race' then case p_mode when 'puzzle' then _num(p.stats, 'bestPuzzle') when 'survival' then _num(p.stats, 'bestSurvival') else p.wins end end desc nulls last,
           p.created_at
  limit 20
$$;

-- rechten: hulpfuncties zijn niet van buitenaf aan te roepen
revoke all on function public._ensure_day(uuid), public._add_xp(uuid, int), public._check_ach(uuid), public._today_add(uuid, text, numeric, boolean),
  public._profile_json(public.profiles) from public, anon, authenticated;
revoke all on function public.create_profile(text, jsonb), public.get_profile(), public.finish_game(jsonb), public.finish_party(text, bigint, jsonb),
  public.claim_party_win(text, bigint), public.buy_item(text), public.equip_item(text), public.claim_daily(), public.claim_quest(int), public.set_name(text) from public, anon;
grant execute on function public.create_profile(text, jsonb), public.get_profile(), public.finish_game(jsonb), public.finish_party(text, bigint, jsonb),
  public.claim_party_win(text, bigint), public.buy_item(text), public.equip_item(text), public.claim_daily(), public.claim_quest(int), public.set_name(text) to authenticated;
grant execute on function public.leaderboard(text) to anon, authenticated;

-- extra slot op de deur: direct schrijven in deze tabellen kan nooit (RLS blokkeert het al, dit is dubbel zeker)
revoke insert, update, delete, truncate on public.profiles, public.party_reports, public.items from anon, authenticated;
revoke select on public.party_reports from anon, authenticated;
