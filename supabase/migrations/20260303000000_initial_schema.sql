-- =====================================================
-- onepatientonedoctor.work — Digital Twin Healthcare Platform
-- Supabase Schema + RLS Policies
-- =====================================================

-- PROFILES
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  avatar_url text,
  role text check (role in ('patient', 'doctor', 'admin')) default 'patient',
  abha_id text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  blood_group text,
  phone text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);

-- DIGITAL TWINS
create table if not exists public.digital_twins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  health_score integer default 75 check (health_score >= 0 and health_score <= 100),
  bmi numeric(5,2),
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  systolic_bp integer,
  diastolic_bp integer,
  heart_rate integer,
  glucose_level numeric(6,2),
  spo2 numeric(4,1),
  temperature numeric(4,1),
  risk_factors jsonb default '[]'::jsonb,
  genetic_markers jsonb default '{}'::jsonb,
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.digital_twins enable row level security;
create policy "Users can view own twin" on public.digital_twins for select using (auth.uid() = user_id);
create policy "Users can insert own twin" on public.digital_twins for insert with check (auth.uid() = user_id);
create policy "Users can update own twin" on public.digital_twins for update using (auth.uid() = user_id);

-- HEALTH RECORDS
create table if not exists public.health_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  record_type text check (record_type in ('diagnosis', 'lab_report', 'prescription', 'imaging', 'surgery', 'other')) not null,
  title text not null,
  description text,
  doctor_name text,
  hospital_name text,
  date date not null,
  fhir_resource jsonb,
  file_url text,
  created_at timestamptz default now()
);

alter table public.health_records enable row level security;
create policy "Users can view own records" on public.health_records for select using (auth.uid() = user_id);
create policy "Users can insert own records" on public.health_records for insert with check (auth.uid() = user_id);
create policy "Users can update own records" on public.health_records for update using (auth.uid() = user_id);
create policy "Users can delete own records" on public.health_records for delete using (auth.uid() = user_id);
create index if not exists idx_health_records_user_date on public.health_records(user_id, date desc);

-- APPOINTMENTS
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  doctor_name text not null,
  specialty text,
  hospital_name text,
  appointment_date date not null,
  appointment_time time not null,
  status text check (status in ('scheduled', 'completed', 'cancelled', 'no_show')) default 'scheduled',
  notes text,
  is_teleconsult boolean default false,
  created_at timestamptz default now()
);

alter table public.appointments enable row level security;
create policy "Users can view own appointments" on public.appointments for select using (auth.uid() = user_id);
create policy "Users can insert own appointments" on public.appointments for insert with check (auth.uid() = user_id);
create policy "Users can update own appointments" on public.appointments for update using (auth.uid() = user_id);
create policy "Users can delete own appointments" on public.appointments for delete using (auth.uid() = user_id);
create index if not exists idx_appointments_user_date on public.appointments(user_id, appointment_date asc);

-- MEDICATIONS
create table if not exists public.medications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  dosage text not null,
  frequency text not null,
  start_date date not null,
  end_date date,
  prescribed_by text,
  is_active boolean default true,
  notes text,
  created_at timestamptz default now()
);

alter table public.medications enable row level security;
create policy "Users can view own medications" on public.medications for select using (auth.uid() = user_id);
create policy "Users can insert own medications" on public.medications for insert with check (auth.uid() = user_id);
create policy "Users can update own medications" on public.medications for update using (auth.uid() = user_id);
create policy "Users can delete own medications" on public.medications for delete using (auth.uid() = user_id);

-- IMMUNIZATIONS
create table if not exists public.immunizations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  vaccine_name text not null,
  date_administered date not null,
  dose_number integer,
  next_due_date date,
  administered_by text,
  lot_number text,
  created_at timestamptz default now()
);

alter table public.immunizations enable row level security;
create policy "Users can view own immunizations" on public.immunizations for select using (auth.uid() = user_id);
create policy "Users can insert own immunizations" on public.immunizations for insert with check (auth.uid() = user_id);
create policy "Users can update own immunizations" on public.immunizations for update using (auth.uid() = user_id);
create policy "Users can delete own immunizations" on public.immunizations for delete using (auth.uid() = user_id);
create index if not exists idx_immunizations_user on public.immunizations(user_id, date_administered desc);

-- ALLERGIES
create table if not exists public.allergies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  allergen text not null,
  reaction text,
  severity text check (severity in ('mild', 'moderate', 'severe', 'life_threatening')) default 'mild',
  diagnosed_date date,
  created_at timestamptz default now()
);

alter table public.allergies enable row level security;
create policy "Users can view own allergies" on public.allergies for select using (auth.uid() = user_id);
create policy "Users can insert own allergies" on public.allergies for insert with check (auth.uid() = user_id);
create policy "Users can update own allergies" on public.allergies for update using (auth.uid() = user_id);
create policy "Users can delete own allergies" on public.allergies for delete using (auth.uid() = user_id);

-- CONSENT RECORDS (DPDP Act compliance)
create table if not exists public.consent_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  requester_name text not null,
  purpose text not null,
  data_types jsonb default '[]'::jsonb,
  granted boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.consent_records enable row level security;
create policy "Users can view own consents" on public.consent_records for select using (auth.uid() = user_id);
create policy "Users can insert own consents" on public.consent_records for insert with check (auth.uid() = user_id);
create policy "Users can update own consents" on public.consent_records for update using (auth.uid() = user_id);
