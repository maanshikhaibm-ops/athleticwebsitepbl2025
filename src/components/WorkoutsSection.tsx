import { useState, useEffect } from 'react';
import { Plus, Trash2, Dumbbell, Clock, Flame } from 'lucide-react';
import { supabase, Workout } from '../lib/supabase';

interface WorkoutsSectionProps {
  athleteId: string;
}

export default function WorkoutsSection({ athleteId }: WorkoutsSectionProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workout_type: '',
    duration_minutes: '',
    intensity: 'moderate',
    workout_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadWorkouts();
  }, [athleteId]);

  const loadWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('workout_date', { ascending: false });

    if (error) {
      console.error('Error loading workouts:', error);
    } else if (data) {
      setWorkouts(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('workouts').insert([
      {
        athlete_id: athleteId,
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes),
      },
    ]);

    if (error) {
      console.error('Error adding workout:', error);
    } else {
      setShowForm(false);
      setFormData({
        workout_type: '',
        duration_minutes: '',
        intensity: 'moderate',
        workout_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      loadWorkouts();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id);

    if (error) {
      console.error('Error deleting workout:', error);
    } else {
      loadWorkouts();
    }
  };

  const getIntensityColor = (intensity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[intensity] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Workouts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Workout</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Workout Type
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Running, Swimming, Weightlifting"
                  value={formData.workout_type}
                  onChange={(e) => setFormData({ ...formData, workout_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  required
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Intensity
                </label>
                <select
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.workout_date}
                  onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })}
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
                placeholder="Additional details about the workout..."
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
                Save Workout
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {workout.workout_type}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {new Date(workout.workout_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-slate-600" />
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded capitalize ${getIntensityColor(
                        workout.intensity
                      )}`}
                    >
                      {workout.intensity}
                    </span>
                  </div>
                </div>

                {workout.notes && (
                  <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100">
                    {workout.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(workout.id)}
                className="ml-4 text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No workouts recorded yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first workout
          </button>
        </div>
      )}
    </div>
  );
}
