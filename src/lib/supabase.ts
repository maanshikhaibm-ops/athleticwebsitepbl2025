import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Athlete {
  id: string;
  name: string;
  email: string | null;
  sport: string;
  team: string;
  date_of_birth: string | null;
  height_cm: number;
  weight_kg: number;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  athlete_id: string;
  workout_type: string;
  duration_minutes: number;
  intensity: string;
  notes: string;
  workout_date: string;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  athlete_id: string;
  metric_type: string;
  value: number;
  unit: string;
  recorded_date: string;
  notes: string;
  created_at: string;
}

export interface HealthStat {
  id: string;
  athlete_id: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  sleep_hours: number;
  hydration_level: string;
  stress_level: number;
  recorded_date: string;
  notes: string;
  created_at: string;
}
