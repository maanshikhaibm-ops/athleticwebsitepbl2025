import { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { supabase, PerformanceMetric, Workout } from '../lib/supabase';

interface ProgressChartsProps {
  athleteId: string;
}

export default function ProgressCharts({ athleteId }: ProgressChartsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [athleteId]);

  const loadData = async () => {
    const [metricsResult, workoutsResult] = await Promise.all([
      supabase
        .from('performance_metrics')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('recorded_date', { ascending: true }),
      supabase
        .from('workouts')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('workout_date', { ascending: true }),
    ]);

    if (metricsResult.data) setMetrics(metricsResult.data);
    if (workoutsResult.data) setWorkouts(workoutsResult.data);
  };

  const metricTypes = Array.from(new Set(metrics.map((m) => m.metric_type)));
  const filteredMetrics =
    selectedMetricType === 'all'
      ? metrics
      : metrics.filter((m) => m.metric_type === selectedMetricType);

  const getWorkoutStats = () => {
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

    const last30Days = workouts.filter((w) => {
      const date = new Date(w.workout_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });

    return {
      totalWorkouts,
      totalMinutes,
      avgDuration,
      recentWorkouts: last30Days.length,
    };
  };

  const getMetricTrend = (metricType: string) => {
    const typeMetrics = metrics.filter((m) => m.metric_type === metricType);
    if (typeMetrics.length < 2) return { trend: 'neutral', change: 0 };

    const recent = typeMetrics.slice(-3);
    const older = typeMetrics.slice(-6, -3);

    if (older.length === 0) return { trend: 'neutral', change: 0 };

    const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(Math.round(change)),
    };
  };

  const stats = getWorkoutStats();

  const renderSimpleChart = (data: PerformanceMetric[]) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="space-y-2">
        {data.map((metric, index) => {
          const height = ((metric.value - minValue) / range) * 100;
          const color = metric.metric_type === 'speed' ? 'bg-blue-500' :
                       metric.metric_type === 'strength' ? 'bg-green-500' :
                       metric.metric_type === 'endurance' ? 'bg-orange-500' : 'bg-cyan-500';

          return (
            <div key={metric.id} className="flex items-center gap-3">
              <div className="text-xs text-slate-500 w-20">
                {new Date(metric.recorded_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                <div
                  className={`${color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${height}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-medium text-slate-900">
                    {metric.value} {metric.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Progress Charts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Total Workouts</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalWorkouts}</p>
          <p className="text-xs text-slate-500 mt-1">
            {stats.recentWorkouts} in last 30 days
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Total Minutes</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalMinutes}</p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round(stats.totalMinutes / 60)} hours trained
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Avg Duration</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.avgDuration}</p>
          <p className="text-xs text-slate-500 mt-1">minutes per workout</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Metrics Tracked</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.length}</p>
          <p className="text-xs text-slate-500 mt-1">{metricTypes.length} different types</p>
        </div>
      </div>

      {metricTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Performance Trends</h3>
            <select
              value={selectedMetricType}
              onChange={(e) => setSelectedMetricType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Metrics</option>
              {metricTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {filteredMetrics.length > 0 ? (
            renderSimpleChart(filteredMetrics)
          ) : (
            <p className="text-center text-slate-500 py-8">
              No metrics available for the selected type
            </p>
          )}
        </div>
      )}

      {metricTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricTypes.map((type) => {
            const trend = getMetricTrend(type);
            return (
              <div
                key={type}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-5"
              >
                <h4 className="text-sm font-medium text-slate-600 capitalize mb-2">{type}</h4>
                <div className="flex items-baseline gap-2">
                  <TrendingUp
                    className={`w-5 h-5 ${
                      trend.trend === 'up'
                        ? 'text-green-600'
                        : trend.trend === 'down'
                        ? 'text-red-600'
                        : 'text-slate-400'
                    }`}
                  />
                  {trend.change > 0 && (
                    <span
                      className={`text-lg font-bold ${
                        trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {trend.change}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {trend.trend === 'up'
                    ? 'Improving'
                    : trend.trend === 'down'
                    ? 'Declining'
                    : 'Stable'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {metrics.length === 0 && workouts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No data available yet.</p>
          <p className="text-sm text-slate-400 mt-2">
            Add workouts and performance metrics to see progress charts.
          </p>
        </div>
      )}
    </div>
  );
}
