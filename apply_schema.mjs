// Schema application script for Supabase project zsqnifydgszscstsstba
// Uses Node.js with process.env and direct HTTP calls with SSL bypass

import https from 'https';
import { readFileSync } from 'fs';

const PROJECT_URL = 'zsqnifydgszscstsstba.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcW5pZnlkZ3N6c2NzdHNzdGJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjUzNDQyMywiZXhwIjoyMDg4MTEwNDIzfQ.dsA9nafZeaxtZsF_hyfn1PejtOChu6Z3ddfJ7iYKkFY';

// Custom HTTPS agent that bypasses SSL certificate verification
const agent = new https.Agent({ rejectUnauthorized: false });

async function executeSQL(sql, description) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });

    const options = {
      hostname: PROJECT_URL,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      agent,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data, description });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function executeSQLDirect(sql, description) {
  // Use the pg-meta endpoint if available, otherwise use RPC
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });

    const options = {
      hostname: PROJECT_URL,
      port: 443,
      path: '/pg-meta/v1/query',
      method: 'POST',
      agent,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data, description });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// SQL statements to execute — split into individual statements
const statements = [
  // ========== PROFILES TABLE ==========
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
  { desc: "RLS: profiles enable", sql: "alter table public.profiles enable row level security" },
  { desc: "RLS policy: profiles select", sql: `create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: profiles insert", sql: `create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: profiles update", sql: `create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id)` },

  // ========== DIGITAL TWINS TABLE ==========
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
  { desc: "RLS: digital_twins enable", sql: "alter table public.digital_twins enable row level security" },
  { desc: "RLS policy: digital_twins select", sql: `create policy "Users can view own twin" on public.digital_twins for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: digital_twins insert", sql: `create policy "Users can insert own twin" on public.digital_twins for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: digital_twins update", sql: `create policy "Users can update own twin" on public.digital_twins for update using (auth.uid() = user_id)` },

  // ========== HEALTH RECORDS TABLE ==========
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
  { desc: "RLS: health_records enable", sql: "alter table public.health_records enable row level security" },
  { desc: "RLS policy: health_records select", sql: `create policy "Users can view own records" on public.health_records for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: health_records insert", sql: `create policy "Users can insert own records" on public.health_records for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: health_records update", sql: `create policy "Users can update own records" on public.health_records for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: health_records delete", sql: `create policy "Users can delete own records" on public.health_records for delete using (auth.uid() = user_id)` },

  // ========== APPOINTMENTS TABLE ==========
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
  { desc: "RLS: appointments enable", sql: "alter table public.appointments enable row level security" },
  { desc: "RLS policy: appointments select", sql: `create policy "Users can view own appointments" on public.appointments for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: appointments insert", sql: `create policy "Users can insert own appointments" on public.appointments for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: appointments update", sql: `create policy "Users can update own appointments" on public.appointments for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: appointments delete", sql: `create policy "Users can delete own appointments" on public.appointments for delete using (auth.uid() = user_id)` },

  // ========== MEDICATIONS TABLE ==========
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
  { desc: "RLS: medications enable", sql: "alter table public.medications enable row level security" },
  { desc: "RLS policy: medications select", sql: `create policy "Users can view own medications" on public.medications for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: medications insert", sql: `create policy "Users can insert own medications" on public.medications for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: medications update", sql: `create policy "Users can update own medications" on public.medications for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: medications delete", sql: `create policy "Users can delete own medications" on public.medications for delete using (auth.uid() = user_id)` },

  // ========== IMMUNIZATIONS TABLE ==========
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
  { desc: "RLS: immunizations enable", sql: "alter table public.immunizations enable row level security" },
  { desc: "RLS policy: immunizations select", sql: `create policy "Users can view own immunizations" on public.immunizations for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: immunizations insert", sql: `create policy "Users can insert own immunizations" on public.immunizations for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: immunizations update", sql: `create policy "Users can update own immunizations" on public.immunizations for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: immunizations delete", sql: `create policy "Users can delete own immunizations" on public.immunizations for delete using (auth.uid() = user_id)` },

  // ========== ALLERGIES TABLE ==========
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
  { desc: "RLS: allergies enable", sql: "alter table public.allergies enable row level security" },
  { desc: "RLS policy: allergies select", sql: `create policy "Users can view own allergies" on public.allergies for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: allergies insert", sql: `create policy "Users can insert own allergies" on public.allergies for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: allergies update", sql: `create policy "Users can update own allergies" on public.allergies for update using (auth.uid() = user_id)` },
  { desc: "RLS policy: allergies delete", sql: `create policy "Users can delete own allergies" on public.allergies for delete using (auth.uid() = user_id)` },

  // ========== CONSENT RECORDS TABLE ==========
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
  { desc: "RLS: consent_records enable", sql: "alter table public.consent_records enable row level security" },
  { desc: "RLS policy: consent_records select", sql: `create policy "Users can view own consents" on public.consent_records for select using (auth.uid() = user_id)` },
  { desc: "RLS policy: consent_records insert", sql: `create policy "Users can insert own consents" on public.consent_records for insert with check (auth.uid() = user_id)` },
  { desc: "RLS policy: consent_records update", sql: `create policy "Users can update own consents" on public.consent_records for update using (auth.uid() = user_id)` },
];

// Helper: POST to Supabase REST
function postREST(path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const options = {
      hostname: PROJECT_URL,
      port: 443,
      path,
      method: 'POST',
      agent,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        'Prefer': 'return=representation',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log('=== Supabase Schema Application ===');
  console.log(`Project: zsqnifydgszscstsstba.supabase.co`);
  console.log(`Total statements: ${statements.length}`);
  console.log('');

  // Strategy: Use Supabase's built-in pg_meta endpoint or PostgREST RPC
  // The pg_meta endpoint is at /pg-meta/v1/query (internal, needs special access)
  // Instead, we'll execute SQL via the Supabase Management API's database endpoint
  // using the service_role key as an Authorization header

  // Try the Management API database query endpoint
  const testResult = await new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: 'SELECT current_database()' });
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: '/v1/projects/zsqnifydgszscstsstba/database/query',
      method: 'POST',
      agent,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  console.log(`Management API test: HTTP ${testResult.status} -> ${testResult.body}`);
  console.log('');

  // Results tracking
  const results = { succeeded: [], failed: [] };

  for (const stmt of statements) {
    process.stdout.write(`[...] ${stmt.desc} ... `);

    try {
      // Try Management API first
      const result = await new Promise((resolve, reject) => {
        const body = JSON.stringify({ query: stmt.sql });
        const options = {
          hostname: 'api.supabase.com',
          port: 443,
          path: '/v1/projects/zsqnifydgszscstsstba/database/query',
          method: 'POST',
          agent,
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        };
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
      });

      if (result.status === 200 || result.status === 201) {
        console.log(`OK (HTTP ${result.status})`);
        results.succeeded.push(stmt.desc);
      } else {
        const parsed = JSON.parse(result.body);
        if (parsed.message && (parsed.message.includes('already exists') || parsed.message.includes('duplicate'))) {
          console.log(`SKIP (already exists)`);
          results.succeeded.push(`${stmt.desc} (already existed)`);
        } else {
          console.log(`FAIL (HTTP ${result.status}): ${result.body}`);
          results.failed.push({ desc: stmt.desc, error: result.body });
        }
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      results.failed.push({ desc: stmt.desc, error: err.message });
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`\nSucceeded (${results.succeeded.length}):`);
  results.succeeded.forEach(s => console.log(`  + ${s}`));

  if (results.failed.length > 0) {
    console.log(`\nFailed (${results.failed.length}):`);
    results.failed.forEach(f => console.log(`  - ${f.desc}: ${f.error}`));
  } else {
    console.log('\nAll statements applied successfully!');
  }
}

main().catch(console.error);
