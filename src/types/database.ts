export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'doctor' | 'admin'
          abha_id?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          blood_group?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'doctor' | 'admin'
          abha_id?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          blood_group?: string | null
          phone?: string | null
          address?: string | null
          updated_at?: string
        }
      }
      digital_twins: {
        Row: {
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
          risk_factors: Json
          genetic_markers: Json
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          health_score?: number
          bmi?: number | null
          height_cm?: number | null
          weight_kg?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          heart_rate?: number | null
          glucose_level?: number | null
          spo2?: number | null
          temperature?: number | null
          risk_factors?: Json
          genetic_markers?: Json
          last_updated?: string
          created_at?: string
        }
        Update: {
          health_score?: number
          bmi?: number | null
          height_cm?: number | null
          weight_kg?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          heart_rate?: number | null
          glucose_level?: number | null
          spo2?: number | null
          temperature?: number | null
          risk_factors?: Json
          genetic_markers?: Json
          last_updated?: string
        }
      }
      health_records: {
        Row: {
          id: string
          user_id: string
          record_type: 'diagnosis' | 'lab_report' | 'prescription' | 'imaging' | 'surgery' | 'other'
          title: string
          description: string | null
          doctor_name: string | null
          hospital_name: string | null
          date: string
          fhir_resource: Json | null
          file_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          record_type: 'diagnosis' | 'lab_report' | 'prescription' | 'imaging' | 'surgery' | 'other'
          title: string
          description?: string | null
          doctor_name?: string | null
          hospital_name?: string | null
          date: string
          fhir_resource?: Json | null
          file_url?: string | null
          created_at?: string
        }
        Update: {
          record_type?: 'diagnosis' | 'lab_report' | 'prescription' | 'imaging' | 'surgery' | 'other'
          title?: string
          description?: string | null
          doctor_name?: string | null
          hospital_name?: string | null
          date?: string
          fhir_resource?: Json | null
          file_url?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          doctor_name: string
          specialty: string | null
          hospital_name: string | null
          appointment_date: string
          appointment_time: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          is_teleconsult: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          doctor_name: string
          specialty?: string | null
          hospital_name?: string | null
          appointment_date: string
          appointment_time: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          is_teleconsult?: boolean
          created_at?: string
        }
        Update: {
          doctor_name?: string
          specialty?: string | null
          hospital_name?: string | null
          appointment_date?: string
          appointment_time?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          is_teleconsult?: boolean
        }
      }
      medications: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          start_date: string
          end_date?: string | null
          prescribed_by?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          dosage?: string
          frequency?: string
          start_date?: string
          end_date?: string | null
          prescribed_by?: string | null
          is_active?: boolean
          notes?: string | null
        }
      }
      immunizations: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          vaccine_name: string
          date_administered: string
          dose_number?: number | null
          next_due_date?: string | null
          administered_by?: string | null
          lot_number?: string | null
          created_at?: string
        }
        Update: {
          vaccine_name?: string
          date_administered?: string
          dose_number?: number | null
          next_due_date?: string | null
          administered_by?: string | null
          lot_number?: string | null
        }
      }
      allergies: {
        Row: {
          id: string
          user_id: string
          allergen: string
          reaction: string | null
          severity: 'mild' | 'moderate' | 'severe' | 'life_threatening'
          diagnosed_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          allergen: string
          reaction?: string | null
          severity?: 'mild' | 'moderate' | 'severe' | 'life_threatening'
          diagnosed_date?: string | null
          created_at?: string
        }
        Update: {
          allergen?: string
          reaction?: string | null
          severity?: 'mild' | 'moderate' | 'severe' | 'life_threatening'
          diagnosed_date?: string | null
        }
      }
      consent_records: {
        Row: {
          id: string
          user_id: string
          requester_name: string
          purpose: string
          data_types: Json
          granted: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          requester_name: string
          purpose: string
          data_types?: Json
          granted?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          granted?: boolean
          expires_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
