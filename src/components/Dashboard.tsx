import { useState, useEffect } from 'react';
import { Activity, Dumbbell, TrendingUp, Heart } from 'lucide-react';
import { supabase, Athlete } from '../lib/supabase';
import AthleteSelector from './AthleteSelector';
import PerformanceSection from './PerformanceSection';
import WorkoutsSection from './WorkoutsSection';
import ProgressCharts from './ProgressCharts';
import HealthStatsSection from './HealthStatsSection';

type ActiveSection = 'performance' | 'workouts' | 'progress' | 'health';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('performance');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading athletes:', error);
    } else if (data) {
      setAthletes(data);
      if (data.length > 0 && !selectedAthlete) {
        setSelectedAthlete(data[0]);
      }
    }
  };

  const renderSection = () => {
    if (!selectedAthlete) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No athletes found. Create one to get started.</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'performance':
        return <PerformanceSection athleteId={selectedAthlete.id} />;
      case 'workouts':
        return <WorkoutsSection athleteId={selectedAthlete.id} />;
      case 'progress':
        return <ProgressCharts athleteId={selectedAthlete.id} />;
      case 'health':
        return <HealthStatsSection athleteId={selectedAthlete.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-slate-900">Athlete Monitor</h1>
            </div>
            <AthleteSelector
              athletes={athletes}
              selectedAthlete={selectedAthlete}
              onSelectAthlete={setSelectedAthlete}
              onAthletesChange={loadAthletes}
            />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-2 space-y-1">
              <button
                onClick={() => setActiveSection('performance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'performance'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Performance</span>
              </button>
              <button
                onClick={() => setActiveSection('workouts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'workouts'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Dumbbell className="w-5 h-5" />
                <span className="font-medium">Workouts</span>
              </button>
              <button
                onClick={() => setActiveSection('progress')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'progress'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">Progress Charts</span>
              </button>
              <button
                onClick={() => setActiveSection('health')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'health'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Health Stats</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
}
