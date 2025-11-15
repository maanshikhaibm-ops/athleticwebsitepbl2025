/*
  # Athlete Monitoring System Schema

  1. New Tables
    - `athletes`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, unique)
      - `sport` (text)
      - `team` (text)
      - `date_of_birth` (date)
      - `height_cm` (numeric)
      - `weight_kg` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `workouts`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key)
      - `workout_type` (text)
      - `duration_minutes` (integer)
      - `intensity` (text: low, moderate, high)
      - `notes` (text)
      - `workout_date` (date)
      - `created_at` (timestamptz)
    
    - `performance_metrics`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key)
      - `metric_type` (text: speed, strength, endurance, agility)
      - `value` (numeric)
      - `unit` (text)
      - `recorded_date` (date)
      - `notes` (text)
      - `created_at` (timestamptz)
    
    - `health_stats`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key)
      - `heart_rate` (integer)
      - `blood_pressure_systolic` (integer)
      - `blood_pressure_diastolic` (integer)
      - `sleep_hours` (numeric)
      - `hydration_level` (text: poor, fair, good, excellent)
      - `stress_level` (integer: 1-10)
      - `recorded_date` (date)
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (demo purposes)
    
  3. Important Notes
    - All tables use UUID primary keys
    - Foreign keys maintain referential integrity
    - Timestamps track creation times
    - Default values ensure data consistency
*/

CREATE TABLE IF NOT EXISTS athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  sport text DEFAULT '',
  team text DEFAULT '',
  date_of_birth date,
  height_cm numeric DEFAULT 0,
  weight_kg numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE,
  workout_type text NOT NULL,
  duration_minutes integer DEFAULT 0,
  intensity text DEFAULT 'moderate',
  notes text DEFAULT '',
  workout_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  recorded_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE,
  heart_rate integer DEFAULT 0,
  blood_pressure_systolic integer DEFAULT 0,
  blood_pressure_diastolic integer DEFAULT 0,
  sleep_hours numeric DEFAULT 0,
  hydration_level text DEFAULT 'fair',
  stress_level integer DEFAULT 5,
  recorded_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to athletes"
  ON athletes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to athletes"
  ON athletes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to athletes"
  ON athletes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from athletes"
  ON athletes FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to workouts"
  ON workouts FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to workouts"
  ON workouts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to workouts"
  ON workouts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from workouts"
  ON workouts FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to performance_metrics"
  ON performance_metrics FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to performance_metrics"
  ON performance_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to performance_metrics"
  ON performance_metrics FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from performance_metrics"
  ON performance_metrics FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to health_stats"
  ON health_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to health_stats"
  ON health_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to health_stats"
  ON health_stats FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from health_stats"
  ON health_stats FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS workouts_athlete_id_idx ON workouts(athlete_id);
CREATE INDEX IF NOT EXISTS performance_metrics_athlete_id_idx ON performance_metrics(athlete_id);
CREATE INDEX IF NOT EXISTS health_stats_athlete_id_idx ON health_stats(athlete_id);