import { useState, useEffect } from 'react';
import { Plus, Trash2, Heart, Activity, Moon, Droplet, Brain } from 'lucide-react';
import { supabase, HealthStat } from '../lib/supabase';

interface HealthStatsSectionProps {
  athleteId: string;
}

export default function HealthStatsSection({ athleteId }: HealthStatsSectionProps) {
  const [stats, setStats] = useState<HealthStat[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    sleep_hours: '',
    hydration_level: 'fair',
    stress_level: '5',
    recorded_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadStats();
  }, [athleteId]);

  const loadStats = async () => {
    const { data, error } = await supabase
      .from('health_stats')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('recorded_date', { ascending: false });

    if (error) {
      console.error('Error loading health stats:', error);
    } else if (data) {
      setStats(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('health_stats').insert([
      {
        athlete_id: athleteId,
        heart_rate: parseInt(formData.heart_rate) || 0,
        blood_pressure_systolic: parseInt(formData.blood_pressure_systolic) || 0,
        blood_pressure_diastolic: parseInt(formData.blood_pressure_diastolic) || 0,
        sleep_hours: parseFloat(formData.sleep_hours) || 0,
        hydration_level: formData.hydration_level,
        stress_level: parseInt(formData.stress_level),
        recorded_date: formData.recorded_date,
        notes: formData.notes,
      },
    ]);

    if (error) {
      console.error('Error adding health stat:', error);
    } else {
      setShowForm(false);
      setFormData({
        heart_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        sleep_hours: '',
        hydration_level: 'fair',
        stress_level: '5',
        recorded_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      loadStats();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('health_stats').delete().eq('id', id);

    if (error) {
      console.error('Error deleting health stat:', error);
    } else {
      loadStats();
    }
  };

  const getLatestStats = () => {
    if (stats.length === 0) return null;
    return stats[0];
  };

  const getHydrationColor = (level: string) => {
    const colors: Record<string, string> = {
      poor: 'bg-red-100 text-red-700',
      fair: 'bg-yellow-100 text-yellow-700',
      good: 'bg-green-100 text-green-700',
      excellent: 'bg-blue-100 text-blue-700',
    };
    return colors[level] || 'bg-slate-100 text-slate-700';
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return 'bg-green-100 text-green-700';
    if (level <= 6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const latest = getLatestStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Health Stats</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stats</span>
        </button>
      </div>

      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Heart Rate</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{latest.heart_rate}</p>
            <p className="text-xs text-slate-500 mt-1">bpm</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Blood Pressure</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {latest.blood_pressure_systolic}/{latest.blood_pressure_diastolic}
            </p>
            <p className="text-xs text-slate-500 mt-1">mmHg</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Sleep</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{latest.sleep_hours}</p>
            <p className="text-xs text-slate-500 mt-1">hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-cyan-100 text-cyan-700 rounded-lg">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Hydration</span>
            </div>
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded capitalize ${getHydrationColor(
                latest.hydration_level
              )}`}
            >
              {latest.hydration_level}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Stress</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-900">{latest.stress_level}</p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${getStressColor(
                  latest.stress_level
                )}`}
              >
                /10
              </span>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={formData.heart_rate}
                  onChange={(e) => setFormData({ ...formData, heart_rate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Systolic BP
                </label>
                <input
                  type="number"
                  value={formData.blood_pressure_systolic}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_pressure_systolic: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Diastolic BP
                </label>
                <input
                  type="number"
                  value={formData.blood_pressure_diastolic}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_pressure_diastolic: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sleep (hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hydration Level
                </label>
                <select
                  value={formData.hydration_level}
                  onChange={(e) => setFormData({ ...formData, hydration_level: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stress Level (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stress_level}
                  onChange={(e) => setFormData({ ...formData, stress_level: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.recorded_date}
                  onChange={(e) => setFormData({ ...formData, recorded_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional health observations..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Stats
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {new Date(stat.recorded_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
              </div>
              <button
                onClick={() => handleDelete(stat.id)}
                className="text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Heart Rate</p>
                <p className="text-lg font-semibold text-slate-900">{stat.heart_rate} bpm</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Blood Pressure</p>
                <p className="text-lg font-semibold text-slate-900">
                  {stat.blood_pressure_systolic}/{stat.blood_pressure_diastolic}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Sleep</p>
                <p className="text-lg font-semibold text-slate-900">{stat.sleep_hours}h</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Hydration</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getHydrationColor(
                    stat.hydration_level
                  )}`}
                >
                  {stat.hydration_level}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Stress</p>
                <p className="text-lg font-semibold text-slate-900">{stat.stress_level}/10</p>
              </div>
            </div>

            {stat.notes && (
              <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
                {stat.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {stats.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No health stats recorded yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first health record
          </button>
        </div>
      )}
    </div>
  );
}
