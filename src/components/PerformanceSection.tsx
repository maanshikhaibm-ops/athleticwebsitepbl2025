import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { supabase, PerformanceMetric } from '../lib/supabase';

interface PerformanceSectionProps {
  athleteId: string;
}

export default function PerformanceSection({ athleteId }: PerformanceSectionProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    metric_type: 'speed',
    value: '',
    unit: '',
    recorded_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadMetrics();
  }, [athleteId]);

  const loadMetrics = async () => {
    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('recorded_date', { ascending: false });

    if (error) {
      console.error('Error loading metrics:', error);
    } else if (data) {
      setMetrics(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('performance_metrics').insert([
      {
        athlete_id: athleteId,
        ...formData,
        value: parseFloat(formData.value),
      },
    ]);

    if (error) {
      console.error('Error adding metric:', error);
    } else {
      setShowForm(false);
      setFormData({
        metric_type: 'speed',
        value: '',
        unit: '',
        recorded_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      loadMetrics();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('performance_metrics').delete().eq('id', id);

    if (error) {
      console.error('Error deleting metric:', error);
    } else {
      loadMetrics();
    }
  };

  const getMetricIcon = (type: string) => {
    return <TrendingUp className="w-5 h-5" />;
  };

  const getMetricColor = (type: string) => {
    const colors: Record<string, string> = {
      speed: 'bg-blue-100 text-blue-700',
      strength: 'bg-green-100 text-green-700',
      endurance: 'bg-orange-100 text-orange-700',
      agility: 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Performance Metrics</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Metric</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Metric Type
                </label>
                <select
                  value={formData.metric_type}
                  onChange={(e) => setFormData({ ...formData, metric_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="speed">Speed</option>
                  <option value="strength">Strength</option>
                  <option value="endurance">Endurance</option>
                  <option value="agility">Agility</option>
                </select>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., m/s, kg, min"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
                Save Metric
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${getMetricColor(metric.metric_type)}`}>
                {getMetricIcon(metric.metric_type)}
              </div>
              <button
                onClick={() => handleDelete(metric.id)}
                className="text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-sm font-medium text-slate-500 capitalize mb-1">
              {metric.metric_type}
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              <span className="text-sm text-slate-600">{metric.unit}</span>
            </div>

            <div className="text-xs text-slate-500 mb-2">
              {new Date(metric.recorded_date).toLocaleDateString()}
            </div>

            {metric.notes && (
              <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100">
                {metric.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {metrics.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No performance metrics recorded yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first metric
          </button>
        </div>
      )}
    </div>
  );
}
