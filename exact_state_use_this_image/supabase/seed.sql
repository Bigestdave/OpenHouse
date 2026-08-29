-- ==============================================================================
-- OpenHouse Supabase Schema & Seed Data (US Edition)
-- ==============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Table: workspaces
-- ------------------------------------------------------------------------------
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_name text not null,
  owner_email text not null,
  work_type text check (work_type in ('agency', 'independent', 'manager')) default 'agency',
  portfolio_size text default '25–100 active properties',
  primary_market text default 'New York & Los Angeles',
  team_size text default '5–10 people',
  listing_source text check (listing_source in ('demo', 'webhook', 'csv', 'manual')) default 'webhook',
  require_approval boolean default true,
  default_visibility text check (default_visibility in ('unlisted', 'public', 'password')) default 'unlisted',
  notification_preferences jsonb default '{
    "captureRequired": true,
    "reviewReady": true,
    "published": true,
    "processingFailed": true,
    "everyUpdate": false,
    "channels": ["email", "in_app"]
  }'::jsonb,
  branding jsonb default '{
    "agencyName": "OpenHouse Premier",
    "brandColor": "#194534"
  }'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 2. Table: properties
-- ------------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  title text not null,
  address text not null,
  type text not null,
  bedrooms integer default 1,
  bathrooms integer default 1,
  price text not null,
  description text default '',
  status text not null default 'detected' check (
    status in (
      'detected',
      'checking_media',
      'preparing',
      'quality_check',
      'ready_for_review',
      'live',
      'needs_recapture',
      'paused',
      'failed'
    )
  ),
  experience_url text,
  cover_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 3. Table: spaces (rooms/areas)
-- ------------------------------------------------------------------------------
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  name text not null,
  captured boolean default false,
  verified boolean default false,
  issues text[] default array[]::text[],
  capture_request_id uuid,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 4. Table: media_items
-- ------------------------------------------------------------------------------
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  url text not null,
  type text check (type in ('photo', 'video', 'floor_plan', 'panorama')) default 'photo',
  room text,
  quality text check (quality in ('good', 'acceptable', 'poor', 'unchecked')) default 'unchecked',
  uploaded_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 5. Table: timeline_events (agent activity & decision ledger)
-- ------------------------------------------------------------------------------
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  timestamp timestamptz default now(),
  event text not null,
  detail text,
  type text not null check (
    type in (
      'detection',
      'analysis',
      'capture_request',
      'capture_received',
      'reconstruction',
      'verification',
      'approval',
      'publication',
      'error',
      'info'
    )
  ),
  agent_decision text,
  evidence text,
  tool_used text
);

-- ------------------------------------------------------------------------------
-- 6. Table: capture_requests
-- ------------------------------------------------------------------------------
create table if not exists public.capture_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  property_title text not null,
  room text not null,
  reason text not null,
  instructions text not null,
  estimated_time text default '15 seconds',
  status text not null default 'pending' check (
    status in (
      'pending',
      'sent',
      'awaiting_capture',
      'received',
      'checking',
      'resolved',
      'failed'
    )
  ),
  recipient_name text default 'David Sterling',
  recipient_phone text default '+1 (555) 234-5678',
  recipient_email text default 'david@openhouse.app',
  capture_url text,
  uploaded_media jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 7. Table: bookings (renter/buyer inspection requests)
-- ------------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  property_title text not null,
  renter_name text not null,
  renter_phone text not null,
  renter_email text not null,
  preferred_date text not null,
  preferred_time text not null,
  message text,
  status text check (status in ('requested', 'confirmed', 'completed', 'cancelled')) default 'requested',
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- Indexes for High Performance
-- ------------------------------------------------------------------------------
create index if not exists idx_properties_workspace_status on public.properties(workspace_id, status);
create index if not exists idx_spaces_property on public.spaces(property_id);
create index if not exists idx_timeline_property_time on public.timeline_events(property_id, timestamp desc);
create index if not exists idx_capture_requests_property on public.capture_requests(property_id, status);
create index if not exists idx_bookings_property on public.bookings(property_id);

-- ------------------------------------------------------------------------------
-- Trigger for automatic updated_at timestamps
-- ------------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
  before update on public.properties
  for each row execute function public.handle_updated_at();

drop trigger if exists set_capture_requests_updated_at on public.capture_requests;
create trigger set_capture_requests_updated_at
  before update on public.capture_requests
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- Row-Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
alter table public.workspaces enable row level security;
alter table public.properties enable row level security;
alter table public.spaces enable row level security;
alter table public.media_items enable row level security;
alter table public.timeline_events enable row level security;
alter table public.capture_requests enable row level security;
alter table public.bookings enable row level security;

create policy "Allow all read on workspaces" on public.workspaces for select using (true);
create policy "Allow all write on workspaces" on public.workspaces for all using (true);
create policy "Public can view live properties" on public.properties for select using (status = 'live' or true);
create policy "Allow full access on properties" on public.properties for all using (true);
create policy "Allow full access on spaces" on public.spaces for all using (true);
create policy "Allow full access on media_items" on public.media_items for all using (true);
create policy "Allow full access on timeline_events" on public.timeline_events for all using (true);
create policy "Allow full access on capture_requests" on public.capture_requests for all using (true);
create policy "Allow insert on bookings" on public.bookings for insert with check (true);
create policy "Allow full access on bookings" on public.bookings for all using (true);

-- Realtime Publication
alter publication supabase_realtime add table public.properties;
alter publication supabase_realtime add table public.spaces;
alter publication supabase_realtime add table public.timeline_events;
alter publication supabase_realtime add table public.capture_requests;
alter publication supabase_realtime add table public.bookings;

-- ------------------------------------------------------------------------------
-- Storage Buckets Setup
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('property-media', 'property-media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public) values ('captures', 'captures', true)
on conflict (id) do update set public = true;

create policy "Public media bucket access" on storage.objects for select using (bucket_id in ('property-media', 'captures'));
create policy "Public media bucket upload" on storage.objects for insert with check (bucket_id in ('property-media', 'captures'));

-- ==============================================================================
-- SEED DATA (US Properties)
-- ==============================================================================

-- 1. Default Workspace
insert into public.workspaces (
  id, name, owner_name, owner_email, work_type, portfolio_size, primary_market, team_size, listing_source, require_approval, default_visibility
) values (
  '00000000-0000-0000-0000-000000000001',
  'OpenHouse Premier Workspace',
  'David Sterling',
  'david@openhouse.app',
  'agency',
  '25–100 active properties',
  'New York & Los Angeles',
  '5–10 people',
  'webhook',
  true,
  'unlisted'
) on conflict (id) do nothing;

-- 2. Seed Properties
-- Property 1: 740 Park Avenue (Needs Recapture)
insert into public.properties (
  id, workspace_id, title, address, type, bedrooms, bathrooms, price, description, status, cover_image
) values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  '740 Park Avenue, Apt 12B',
  '740 Park Avenue, Upper East Side, New York, NY 10021',
  '3-Bed Luxury Penthouse',
  3, 3, '$18,500 / month',
  'Iconic pre-war architectural masterpiece with private elevator landing, grand entertaining gallery, wood-burning fireplace, and private terrace.',
  'needs_recapture',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do update set
  title = excluded.title, address = excluded.address, price = excluded.price, description = excluded.description;

-- Property 2: 1048 Ocean Drive (Preparing)
insert into public.properties (
  id, workspace_id, title, address, type, bedrooms, bathrooms, price, description, status, cover_image
) values (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000001',
  '1048 Ocean Drive',
  '1048 Ocean Drive, South Beach, Miami, FL 33139',
  '5-Bed Waterfront Villa',
  5, 6, '$35,000 / month',
  'Modern waterfront sanctuary with infinity-edge pool, private dock, chef kitchen, and panoramic rooftop sunset deck.',
  'preparing',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do update set
  title = excluded.title, address = excluded.address, price = excluded.price, description = excluded.description;

-- Property 3: 452 Beverly Glen Blvd (Quality Check)
insert into public.properties (
  id, workspace_id, title, address, type, bedrooms, bathrooms, price, description, status, cover_image
) values (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000001',
  '452 Beverly Glen Blvd',
  '452 Beverly Glen Blvd, Bel Air, Los Angeles, CA 90077',
  '4-Bed Architectural Estate',
  4, 5, '$24,000 / month',
  'Contemporary estate featuring floor-to-ceiling glass walls, terrazzo floors, smart home automation, and tranquil canyon views.',
  'quality_check',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do update set
  title = excluded.title, address = excluded.address, price = excluded.price, description = excluded.description;

-- Property 4: 880 Lake Washington Blvd (Ready for Review)
insert into public.properties (
  id, workspace_id, title, address, type, bedrooms, bathrooms, price, description, status, cover_image
) values (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000001',
  '880 Lake Washington Blvd',
  '880 Lake Washington Blvd, Seattle, WA 98122',
  '3-Bed Modern Craftsman',
  3, 4, '$12,500 / month',
  'Lakeside residence with panoramic Mount Rainier views, private moorage, open-concept living, and custom walnut finishes.',
  'ready_for_review',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do update set
  title = excluded.title, address = excluded.address, price = excluded.price, description = excluded.description;

-- Property 5: 2100 Ocean Way (Live)
insert into public.properties (
  id, workspace_id, title, address, type, bedrooms, bathrooms, price, description, status, experience_url, cover_image
) values (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000001',
  '2100 Ocean Way, Penthouse 4',
  '2100 Ocean Way, Laguna Beach, CA 92651',
  '4-Bed Coastal Penthouse',
  4, 5, '$45,000 / month',
  'Unrivaled bluff-top oceanfront penthouse with panoramic Pacific views, private elevator access, and wraparound ocean terrace.',
  'live',
  '/view/55555555-5555-5555-5555-555555555555',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do update set
  title = excluded.title, address = excluded.address, price = excluded.price, description = excluded.description;

-- 3. Spaces
insert into public.spaces (property_id, name, captured, verified, issues) values
  ('11111111-1111-1111-1111-111111111111', 'Living Room', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Kitchen', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Primary Suite', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Guest Bedroom', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Library / Den', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Marble Bath', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Private Terrace', false, false, array['Doorway connection from living room missing']);

-- 4. Capture Requests
insert into public.capture_requests (
  id, property_id, property_title, room, reason, instructions, estimated_time, status, recipient_name, recipient_phone, recipient_email, capture_url
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '740 Park Avenue, Apt 12B',
  'Private Terrace',
  'The terrace is listed, but doorway transition coverage from the living room is incomplete.',
  'Record one steady 15-second walkthrough stepping from the living room through the terrace French doors.',
  '15 seconds',
  'awaiting_capture',
  'David Sterling',
  '+1 (555) 234-5678',
  'david@openhouse.app',
  '/capture/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
) on conflict (id) do update set
  property_title = excluded.property_title, room = excluded.room, reason = excluded.reason;

-- 5. Timeline Events
insert into public.timeline_events (property_id, event, detail, type, agent_decision, evidence, tool_used) values
  ('11111111-1111-1111-1111-111111111111', 'New listing detected', 'Property at 740 Park Avenue detected from MLS syndication stream. OpenHouse began intake.', 'detection', 'Ingest property description, media manifest, and room expectations.', null, 'ListingWebhookHandler'),
  ('11111111-1111-1111-1111-111111111111', 'Checking media quality and coverage', 'Evaluating 16 source captures across 7 listed spaces. Checking overlap & doorway visibility.', 'analysis', 'Run multimodal Gemini spatial coverage analysis.', 'Source photographs & architectural floor plan', 'GeminiMediaAnalyzer'),
  ('11111111-1111-1111-1111-111111111111', 'Coverage incomplete for Private Terrace', 'The Terrace is listed, but doorway connection footage is missing. Guided 15-second mobile walkthrough requested.', 'capture_request', 'Pause reconstruction and dispatch capture request link to listing agent.', 'Floor plan indicates terrace access off Living Room, but camera path was occluded.', 'CaptureRequestDispatcher');
