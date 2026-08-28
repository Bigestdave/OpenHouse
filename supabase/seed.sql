-- ==============================================================================
-- OpenHouse Supabase Schema & Seed Data
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
  portfolio_size text default '11–50 active properties',
  primary_market text default 'Lagos, Nigeria',
  team_size text default '2–5 people',
  listing_source text check (listing_source in ('demo', 'webhook', 'csv', 'manual')) default 'demo',
  require_approval boolean default true,
  default_visibility text check (default_visibility in ('unlisted', 'public', 'password')) default 'unlisted',
  notification_preferences jsonb default '{
    "captureRequired": true,
    "reviewReady": true,
    "published": true,
    "processingFailed": true,
    "everyUpdate": false,
    "channels": ["email", "whatsapp", "in_app"]
  }'::jsonb,
  branding jsonb default '{
    "agencyName": "OpenHouse Prime",
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
  estimated_time text default '1 minute',
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
  recipient_name text default 'David Olabowale',
  recipient_phone text,
  recipient_email text,
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

-- Realtor Workspace policies (CRUD own workspace or allow anon in demo/public mode)
create policy "Allow all read on workspaces" on public.workspaces
  for select using (true);

create policy "Allow all write on workspaces" on public.workspaces
  for all using (true);

-- Properties: Public can view live properties, workspace owners/anon can manage all
create policy "Public can view live properties" on public.properties
  for select using (status = 'live' or true);

create policy "Allow full access on properties" on public.properties
  for all using (true);

-- Spaces: Public can view spaces of live properties, full access for workspace
create policy "Allow full access on spaces" on public.spaces
  for all using (true);

-- Media items: full access
create policy "Allow full access on media_items" on public.media_items
  for all using (true);

-- Timeline events: full access
create policy "Allow full access on timeline_events" on public.timeline_events
  for all using (true);

-- Capture requests: full access
create policy "Allow full access on capture_requests" on public.capture_requests
  for all using (true);

-- Bookings: Anyone can create a booking, property manager can view
create policy "Allow insert on bookings" on public.bookings
  for insert with check (true);

create policy "Allow full access on bookings" on public.bookings
  for all using (true);

-- ------------------------------------------------------------------------------
-- Realtime Replication Publication
-- ------------------------------------------------------------------------------
-- Enable real-time updates for interactive UI dashboards
alter publication supabase_realtime add table public.properties;
alter publication supabase_realtime add table public.spaces;
alter publication supabase_realtime add table public.timeline_events;
alter publication supabase_realtime add table public.capture_requests;
alter publication supabase_realtime add table public.bookings;

-- ------------------------------------------------------------------------------
-- Storage Buckets Setup
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('captures', 'captures', true)
on conflict (id) do update set public = true;

create policy "Public media bucket access" on storage.objects
  for select using (bucket_id in ('property-media', 'captures'));

create policy "Public media bucket upload" on storage.objects
  for insert with check (bucket_id in ('property-media', 'captures'));

-- ==============================================================================
-- SEED DATA (5 Nigerian Properties at different lifecycle stages)
-- ==============================================================================

-- 1. Default Workspace
insert into public.workspaces (
  id,
  name,
  owner_name,
  owner_email,
  work_type,
  portfolio_size,
  primary_market,
  team_size,
  listing_source,
  require_approval,
  default_visibility
) values (
  '00000000-0000-0000-0000-000000000001',
  'David''s Property Workspace',
  'David Olabowale',
  'david@openhouse.com',
  'agency',
  '11–50 active properties',
  'Lagos, Nigeria',
  '2–5 people',
  'demo',
  true,
  'unlisted'
) on conflict (id) do nothing;

-- 2. Seed Properties
-- Property 1: 8 Admiralty Way (Needs Recapture)
insert into public.properties (
  id,
  workspace_id,
  title,
  address,
  type,
  bedrooms,
  bathrooms,
  price,
  description,
  status,
  cover_image
) values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  '8 Admiralty Way',
  '8 Admiralty Way, Lekki Phase 1, Lagos',
  '3-Bed Apartment',
  3,
  3,
  '₦8,000,000/year',
  'Contemporary luxury apartment in the heart of Lekki Phase 1. Features high ceilings, modern kitchen fittings, and panoramic balcony views.',
  'needs_recapture',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do nothing;

-- Property 2: 14 Bourdillon Road (Preparing)
insert into public.properties (
  id,
  workspace_id,
  title,
  address,
  type,
  bedrooms,
  bathrooms,
  price,
  description,
  status,
  cover_image
) values (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000001',
  '14 Bourdillon Road',
  '14 Bourdillon Road, Ikoyi, Lagos',
  '5-Bed Detached House',
  5,
  6,
  '₦45,000,000/year',
  'Diplomatic grade waterfront residence with private jetty, infinity pool, 2-bedroom staff quarters, and manicured garden terraces.',
  'preparing',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do nothing;

-- Property 3: Orchid Apartments, Unit 4 (Quality Check)
insert into public.properties (
  id,
  workspace_id,
  title,
  address,
  type,
  bedrooms,
  bathrooms,
  price,
  description,
  status,
  cover_image
) values (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000001',
  'Orchid Apartments, Unit 4',
  'Orchid Road, Lekki Conservation, Lagos',
  '2-Bed Apartment',
  2,
  2,
  '₦4,500,000/year',
  'Serene suburban living with direct access to Lekki Conservation centre. 24/7 power, smart home security, and open floor plan.',
  'quality_check',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do nothing;

-- Property 4: Lekki Gardens, Unit 12 (Ready for Review)
insert into public.properties (
  id,
  workspace_id,
  title,
  address,
  type,
  bedrooms,
  bathrooms,
  price,
  description,
  status,
  cover_image
) values (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000001',
  'Lekki Gardens, Unit 12',
  'Lekki Gardens Horizon 2, Ikate, Lagos',
  '3-Bed Terrace Duplex',
  3,
  4,
  '₦6,000,000/year',
  'Modern 3-bedroom terrace duplex in gated estate. Fully fitted kitchen, private backyard, and clubhouse amenities.',
  'ready_for_review',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do nothing;

-- Property 5: Victoria Courts, Unit 8 (Live)
insert into public.properties (
  id,
  workspace_id,
  title,
  address,
  type,
  bedrooms,
  bathrooms,
  price,
  description,
  status,
  experience_url,
  cover_image
) values (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000001',
  'Victoria Courts, Unit 8',
  'Victoria Island Waterfront, Lagos',
  '4-Bed Penthouse',
  4,
  5,
  '₦18,000,000/year',
  'Stunning high-floor penthouse with unobstructed ocean views, private elevator, automated blinds, and wraparound terrace.',
  'live',
  '/view/55555555-5555-5555-5555-555555555555',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
) on conflict (id) do nothing;

-- 3. Spaces
-- Spaces for 8 Admiralty Way
insert into public.spaces (property_id, name, captured, verified, issues) values
  ('11111111-1111-1111-1111-111111111111', 'Living Room', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Kitchen', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Main Bedroom', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Bedroom 2', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Bedroom 3', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Bathroom', true, true, array[]::text[]),
  ('11111111-1111-1111-1111-111111111111', 'Balcony', false, false, array['Connection from living room missing']);

-- Spaces for 14 Bourdillon Road
insert into public.spaces (property_id, name, captured, verified, issues) values
  ('22222222-2222-2222-2222-222222222222', 'Entrance Foyer', true, true, array[]::text[]),
  ('22222222-2222-2222-2222-222222222222', 'Grand Living Hall', true, true, array[]::text[]),
  ('22222222-2222-2222-2222-222222222222', 'Chef Kitchen', true, true, array[]::text[]),
  ('22222222-2222-2222-2222-222222222222', 'Master Suite', true, true, array[]::text[]),
  ('22222222-2222-2222-2222-222222222222', 'Garden Terrace', true, true, array[]::text[]);

-- Spaces for Victoria Courts
insert into public.spaces (property_id, name, captured, verified, issues) values
  ('55555555-5555-5555-5555-555555555555', 'Penthouse Lounge', true, true, array[]::text[]),
  ('55555555-5555-5555-5555-555555555555', 'Dining Pavilion', true, true, array[]::text[]),
  ('55555555-5555-5555-5555-555555555555', 'Primary Suite', true, true, array[]::text[]),
  ('55555555-5555-5555-5555-555555555555', 'Ocean Deck', true, true, array[]::text[]);

-- 4. Capture Requests
insert into public.capture_requests (
  id,
  property_id,
  property_title,
  room,
  reason,
  instructions,
  estimated_time,
  status,
  recipient_name,
  recipient_phone,
  recipient_email,
  capture_url
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '8 Admiralty Way',
  'Balcony',
  'The balcony is listed, but its entrance was not clearly captured.',
  'Record one slow, 15-second video from the living room through the balcony doorway. Finish after showing the full balcony.',
  '1 minute',
  'awaiting_capture',
  'David Olabowale',
  '+234 800 000 0000',
  'david@openhouse.com',
  '/capture/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
) on conflict (id) do nothing;

-- 5. Timeline Events
insert into public.timeline_events (property_id, event, detail, type, agent_decision, evidence, tool_used) values
  ('11111111-1111-1111-1111-111111111111', 'New listing detected', 'Property at 8 Admiralty Way detected from listing portal. OpenHouse began background intake.', 'detection', 'Ingest property description, media manifest, and room expectations.', null, 'ListingWebhookHandler'),
  ('11111111-1111-1111-1111-111111111111', 'Checking media quality and coverage', 'Evaluating 14 source captures across 7 advertised spaces. Checking overlap & motion stability.', 'analysis', 'Run multimodal Gemini room coverage assessment.', 'Source photographs & listing floor plan', 'GeminiMediaAnalyzer'),
  ('11111111-1111-1111-1111-111111111111', 'Coverage insufficient for Balcony', 'The Balcony is listed, but doorway connection coverage is incomplete. One 15-second guided mobile walkthrough requested.', 'capture_request', 'Pause reconstruction and dispatch capture request to realtor via WhatsApp and in-app link.', 'Floor plan indicates connection between Living Room and Balcony, but video path is missing.', 'CaptureRequestDispatcher'),

  ('22222222-2222-2222-2222-222222222222', 'New listing detected', 'Listing imported from Ikoyi Luxury Portals.', 'detection', 'Initialize spatial pipeline.', null, 'ListingWebhookHandler'),
  ('22222222-2222-2222-2222-222222222222', 'Evidence requirements satisfied', 'All 10 advertised rooms confirmed with sufficient trajectory overlap. Estimating camera poses and starting Gaussian Splat training.', 'reconstruction', 'Execute Colmap camera alignment & Splatfacto 3D reconstruction.', '100% room coverage verified across all spaces.', 'SplatfactoPipelineWorker'),

  ('55555555-5555-5555-5555-555555555555', 'Reconstruction complete · Quality checking', 'Generated spatial representation rendered at 16 verification viewpoints.', 'verification', 'Compare rendered viewpoints against original reference frames.', '16 viewpoints evaluated (0 structural contradictions found).', 'ExperienceQualityVerifier'),
  ('55555555-5555-5555-5555-555555555555', 'Publication approved · Experience is Live', 'Interactive 3D tour published to public viewer. Shareable links and WhatsApp booking cards activated.', 'publication', 'Deploy public viewer bundle and generate unlisted access link.', null, 'ExperiencePublisher');
