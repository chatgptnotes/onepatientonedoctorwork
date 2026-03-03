// Schema application via direct PostgreSQL connection to Supabase
// Uses Supabase pooler (Transaction mode) with service_role key as password

import pg from 'pg';
const { Client } = pg;

const PROJECT_REF = 'zsqnifydgszscstsstba';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcW5pZnlkZ3N6c2NzdHNzdGJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjUzNDQyMywiZXhwIjoyMDg4MTEwNDIzfQ.dsA9nafZeaxtZsF_hyfn1PejtOChu6Z3ddfJ7iYKkFY';

// Supabase connection details
// Mumbai region -> ap-south-1
const connectionConfigs = [
  {
    name: "Pooler Session Mode (port 5432)",
    host: `aws-0-ap-south-1.pooler.supabase.com`,
    port: 5432,
    database: 'postgres',
    user: `postgres.${PROJECT_REF}`,
    password: SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
  {
    name: "Pooler Transaction Mode (port 6543)",
    host: `aws-0-ap-south-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${PROJECT_REF}`,
    password: SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
  {
    name: "Direct DB Connection (port 5432)",
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
];

const SQL_STATEMENTS = [
  // PROFILES
  {
    desc: "CREATE TABLE profiles",
    sql: `create table if not exists public.profiles (
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
)`
  },
  { desc: "RLS enable: profiles", sql: `alter table public.profiles enable row level security` },
  { desc: "RLS policy: profiles SELECT", sql: `create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: profiles INSERT", sql: `create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: profiles UPDATE", sql: `create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id)` },

  // DIGITAL TWINS
  {
    desc: "CREATE TABLE digital_twins",
    sql: `create table if not exists public.digital_twins (
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
)`
  },
  { desc: "RLS enable: digital_twins", sql: `alter table public.digital_twins enable row level security` },
  { desc: "RLS policy: digital_twins SELECT", sql: `create policy "Users can view own twin" on public.digital_twins for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: digital_twins INSERT", sql: `create policy "Users can insert own twin" on public.digital_twins for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: digital_twins UPDATE", sql: `create policy "Users can update own twin" on public.digital_twins for update using (auth.uid() = user_id)` },

  // HEALTH RECORDS
  {
    desc: "CREATE TABLE health_records",
    sql: `create table if not exists public.health_records (
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
)`
  },
  { desc: "RLS enable: health_records", sql: `alter table public.health_records enable row level security` },
  { desc: "RLS policy: health_records SELECT", sql: `create policy "Users can view own records" on public.health_records for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: health_records INSERT", sql: `create policy "Users can insert own records" on public.health_records for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: health_records UPDATE", sql: `create policy "Users can update own records" on public.health_records for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: health_records DELETE", sql: `create policy "Users can delete own records" on public.health_records for delete using (auth.uid() = user_id)` },

  // APPOINTMENTS
  {
    desc: "CREATE TABLE appointments",
    sql: `create table if not exists public.appointments (
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
)`
  },
  { desc: "RLS enable: appointments", sql: `alter table public.appointments enable row level security` },
  { desc: "RLS policy: appointments SELECT", sql: `create policy "Users can view own appointments" on public.appointments for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: appointments INSERT", sql: `create policy "Users can insert own appointments" on public.appointments for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: appointments UPDATE", sql: `create policy "Users can update own appointments" on public.appointments for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: appointments DELETE", sql: `create policy "Users can delete own appointments" on public.appointments for delete using (auth.uid() = user_id)` },

  // MEDICATIONS
  {
    desc: "CREATE TABLE medications",
    sql: `create table if not exists public.medications (
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
)`
  },
  { desc: "RLS enable: medications", sql: `alter table public.medications enable row level security` },
  { desc: "RLS policy: medications SELECT", sql: `create policy "Users can view own medications" on public.medications for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: medications INSERT", sql: `create policy "Users can insert own medications" on public.medications for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: medications UPDATE", sql: `create policy "Users can update own medications" on public.medications for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: medications DELETE", sql: `create policy "Users can delete own medications" on public.medications for delete using (auth.uid() = user_id)` },

  // IMMUNIZATIONS
  {
    desc: "CREATE TABLE immunizations",
    sql: `create table if not exists public.immunizations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  vaccine_name text not null,
  date_administered date not null,
  dose_number integer,
  next_due_date date,
  administered_by text,
  lot_number text,
  created_at timestamptz default now()
)`
  },
  { desc: "RLS enable: immunizations", sql: `alter table public.immunizations enable row level security` },
  { desc: "RLS policy: immunizations SELECT", sql: `create policy "Users can view own immunizations" on public.immunizations for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: immunizations INSERT", sql: `create policy "Users can insert own immunizations" on public.immunizations for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: immunizations UPDATE", sql: `create policy "Users can update own immunizations" on public.immunizations for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: immunizations DELETE", sql: `create policy "Users can delete own immunizations" on public.immunizations for delete using (auth.uid() = user_id)` },

  // ALLERGIES
  {
    desc: "CREATE TABLE allergies",
    sql: `create table if not exists public.allergies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  allergen text not null,
  reaction text,
  severity text check (severity in ('mild', 'moderate', 'severe', 'life_threatening')) default 'mild',
  diagnosed_date date,
  created_at timestamptz default now()
)`
  },
  { desc: "RLS enable: allergies", sql: `alter table public.allergies enable row level security` },
  { desc: "RLS policy: allergies SELECT", sql: `create policy "Users can view own allergies" on public.allergies for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: allergies INSERT", sql: `create policy "Users can insert own allergies" on public.allergies for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: allergies UPDATE", sql: `create policy "Users can update own allergies" on public.allergies for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: allergies DELETE", sql: `create policy "Users can delete own allergies" on public.allergies for delete using (auth.uid() = user_id)` },

  // CONSENT RECORDS
  {
    desc: "CREATE TABLE consent_records",
    sql: `create table if not exists public.consent_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  requester_name text not null,
  purpose text not null,
  data_types jsonb default '[]'::jsonb,
  granted boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
)`
  },
  { desc: "RLS enable: consent_records", sql: `alter table public.consent_records enable row level security` },
  { desc: "RLS policy: consent_records SELECT", sql: `create policy "Users can view own consents" on public.consent_records for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: consent_records INSERT", sql: `create policy "Users can insert own consents" on public.consent_records for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: consent_records UPDATE", sql: `create policy "Users can update own consents" on public.consent_records for update using (auth.uid() = user_id)` },
];

async function tryConnection(config) {
  const client = new Client(config);
  try {
    await client.connect();
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log(`Connected via: ${config.name}`);
    console.log(`  DB: ${result.rows[0].current_database}, User: ${result.rows[0].current_user}`);
    return client;
  } catch (err) {
    console.log(`Failed: ${config.name} -> ${err.message}`);
    try { await client.end(); } catch {}
    return null;
  }
}

async function main() {
  console.log('=== Supabase Schema Application via Direct PG Connection ===\n');

  let client = null;

  for (const config of connectionConfigs) {
    process.stdout.write(`Trying ${config.name}... `);
    client = await tryConnection(config);
    if (client) break;
  }

  if (!client) {
    console.error('\nCould not connect to database via any method.');
    process.exit(1);
  }

  console.log('\n--- Applying SQL statements ---\n');

  const results = { succeeded: [], failed: [] };

  for (const stmt of SQL_STATEMENTS) {
    process.stdout.write(`[...] ${stmt.desc} ... `);
    try {
      await client.query(stmt.sql);
      console.log('OK');
      results.succeeded.push(stmt.desc);
    } catch (err) {
      const msg = err.message;
      if (msg.includes('already exists')) {
        console.log('SKIP (already exists)');
        results.succeeded.push(`${stmt.desc} (already existed)`);
      } else {
        console.log(`FAIL: ${msg}`);
        results.failed.push({ desc: stmt.desc, error: msg });
      }
    }
  }

  await client.end();

  console.log('\n=== FINAL SUMMARY ===');
  console.log(`\nSucceeded (${results.succeeded.length} / ${SQL_STATEMENTS.length}):`);
  results.succeeded.forEach(s => console.log(`  + ${s}`));

  if (results.failed.length > 0) {
    console.log(`\nFailed (${results.failed.length}):`);
    results.failed.forEach(f => console.log(`  - ${f.desc}\n    Error: ${f.error}`));
  } else {
    console.log('\nAll statements applied successfully!');
  }
}

main().catch(console.error);
