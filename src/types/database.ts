// Plain TypeScript interfaces — no supabase-js generics required

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  role: 'patient' | 'doctor' | 'admin'
  abha_id: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | null
  blood_group: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface DigitalTwin {
  id: string
  user_id: string
  health_score: number
  bmi: number | null
  height_cm: number | null
  weight_kg: number | null
  systolic_bp: number | null
  diastolic_bp: number | null
  heart_rate: number | null
  glucose_level: number | null
  spo2: number | null
  temperature: number | null
  risk_factors: unknown
  genetic_markers: unknown
  last_updated: string
  created_at: string
}

export type RecordType = 'diagnosis' | 'lab_report' | 'prescription' | 'imaging' | 'surgery' | 'other'

export interface HealthRecord {
  id: string
  user_id: string
  record_type: RecordType
  title: string
  description: string | null
  doctor_name: string | null
  hospital_name: string | null
  date: string
  fhir_resource: unknown | null
  file_url: string | null
  created_at: string
}

export type AppStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  user_id: string
  doctor_name: string
  specialty: string | null
  hospital_name: string | null
  appointment_date: string
  appointment_time: string
  status: AppStatus
  notes: string | null
  is_teleconsult: boolean
  created_at: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date: string | null
  prescribed_by: string | null
  is_active: boolean
  notes: string | null
  created_at: string
}

export interface Immunization {
  id: string
  user_id: string
  vaccine_name: string
  date_administered: string
  dose_number: number | null
  next_due_date: string | null
  administered_by: string | null
  lot_number: string | null
  created_at: string
}

export type Severity = 'mild' | 'moderate' | 'severe' | 'life_threatening'

export interface Allergy {
  id: string
  user_id: string
  allergen: string
  reaction: string | null
  severity: Severity
  diagnosed_date: string | null
  created_at: string
}

export interface ConsentRecord {
  id: string
  user_id: string
  requester_name: string
  purpose: string
  data_types: unknown
  granted: boolean
  expires_at: string | null
  created_at: string
}

export interface SharedProfile {
  id: string
  user_id: string
  share_token: string
  expires_at: string
  is_active: boolean
  include_vitals: boolean
  include_records: boolean
  include_medications: boolean
  include_allergies: boolean
  include_immunizations: boolean
  viewed_count: number
  access_pin: string | null
  access_log: Array<{
    timestamp: number
    success: boolean
  }> | null
  created_at: string
}
