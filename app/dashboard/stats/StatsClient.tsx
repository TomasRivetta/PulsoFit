'use client';

import { useMemo } from 'react';
import {
  EvolutionChartCard,
  FrequencyCard,
  MuscleDistributionCard,
  SecondaryMetricsSection,
  StatsHeader,
} from '@/app/dashboard/stats/components/StatsDashboardSections';
import type { UserStatsRow } from '@/lib/domain/routines';
import {
  calculateSessionVolume,
  getExerciseSessionSets,
  getRoutineExercisesForSession,
  type SessionSetRecord,
  type WorkoutSessionWithRoutine,
} from '@/lib/domain/workout-sessions';

interface StatsClientProps {
  userStats: UserStatsRow | null;
  sessions: WorkoutSessionWithRoutine[];
}

export default function StatsClient({ userStats, sessions }: StatsClientProps) {
  const timeMetrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const currMonthSessions = sessions.filter(s => new Date(s.start_time) >= thirtyDaysAgo);
    const prevMonthSessions = sessions.filter(s => {
      const d = new Date(s.start_time);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    });

    const calculateVolume = (sess: WorkoutSessionWithRoutine[]) =>
      sess.reduce((total, session) => total + calculateSessionVolume(session.session_data), 0);

    const calculateAvgDuration = (sess: WorkoutSessionWithRoutine[]) => {
      const durations = sess
        .filter(s => s.end_time)
        .map(s => (new Date(s.end_time!).getTime() - new Date(s.start_time).getTime()) / (1000 * 60));
      return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    };

    const currVol = calculateVolume(currMonthSessions);
    const prevVol = calculateVolume(prevMonthSessions);
    const volChange = prevVol > 0 ? ((currVol - prevVol) / prevVol) * 100 : 0;

    const currDur = calculateAvgDuration(currMonthSessions);
    const prevDur = calculateAvgDuration(prevMonthSessions);
    const durChange = prevDur > 0 ? (currDur - prevDur) : 0;

    return { 
      currVol, 
      volChange, 
      avgDuration: currDur, 
      durTrend: durChange,
      strengthIndex: (currVol / 1000).toFixed(2)
    };
  }, [sessions]);

  const weeklyVolume = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return sessions
      .filter(s => new Date(s.start_time) >= oneWeekAgo)
      .reduce((total, session) => total + calculateSessionVolume(session.session_data), 0);
  }, [sessions]);

  const frequencyData = useMemo(() => {
    const now = new Date();
    const weeks = [0, 0, 0, 0, 0];
    
    sessions.forEach(s => {
      const sDate = new Date(s.start_time);
      const diffTime = Math.abs(now.getTime() - sDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks < 5) {
        weeks[4 - diffWeeks]++;
      }
    });

    const avg = weeks.reduce((a, b) => a + b, 0) / 5;
    return { weeks, avg };
  }, [sessions]);

  const muscleDistribution = useMemo(() => {
    const counts = { Legs: 0, Back: 0, Chest: 0, Core: 0 };
    
    sessions.forEach(s => {
      const exercises = getRoutineExercisesForSession(s);
      const sessionData = s.session_data;
      
      exercises.forEach((ex) => {
        const sets = getExerciseSessionSets(sessionData, ex.id);
        const completedCount = sets.filter((set) => set.completed).length;
        
        const target = (ex.target || '').toLowerCase();
        if (target.includes('leg') || target.includes('quad') || target.includes('ham') || target.includes('glute')) counts.Legs += completedCount;
        else if (target.includes('back') || target.includes('lats') || target.includes('traps')) counts.Back += completedCount;
        else if (target.includes('chest') || target.includes('pecs')) counts.Chest += completedCount;
        else if (target.includes('abs') || target.includes('core') || target.includes('oblique')) counts.Core += completedCount;
      });
    });

    const maxVal = Math.max(...Object.values(counts), 1);
    const dominantEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dominant = dominantEntries[0][0];
    const focus = dominant === 'Legs' ? 'Tren Inferior' : 
                  dominant === 'Chest' ? 'Pectorales' : 
                  dominant === 'Back' ? 'Tracción' : 'Estabilidad';

    return { 
      Legs: (counts.Legs / maxVal) * 100, 
      Back: (counts.Back / maxVal) * 100, 
      Chest: (counts.Chest / maxVal) * 100, 
      Core: (counts.Core / maxVal) * 100,
      dominant,
      focus
    };
  }, [sessions]);

  const evolutionCharts = useMemo(() => {
    const exerciseLoads: Record<string, { date: number, load: number }[]> = {};
    
    sessions.forEach(s => {
      const date = new Date(s.start_time).getTime();
      const exercises = getRoutineExercisesForSession(s);
      const data = s.session_data;
      
      exercises.forEach((ex) => {
        const sets = getExerciseSessionSets(data, ex.id);
        const maxLoad = Math.max(...sets.map((set) => set.completed ? Number.parseFloat(set.load) || 0 : 0), 0);
        if (maxLoad > 0) {
          if (!exerciseLoads[ex.name]) exerciseLoads[ex.name] = [];
          exerciseLoads[ex.name].push({ date, load: maxLoad });
        }
      });
    });

    const topExercises = Object.entries(exerciseLoads)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 2);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const startTs = ninetyDaysAgo.getTime();
    const endTs = new Date().getTime();

    const generatePath = (points: { date: number, load: number }[]) => {
      if (points.length < 2) return "";
      const maxL = Math.max(...points.map(p => p.load), 1);
      const sorted = points.sort((a, b) => a.date - b.date);
      
      return sorted.map((p, i) => {
        const x = ((p.date - startTs) / (endTs - startTs)) * 1000;
        const y = 200 - (p.load / maxL) * 160;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ');
    };

    return topExercises.map(([name, points]) => ({
      name,
      path: generatePath(points),
      currentMax: Math.max(...points.map(p => p.load))
    }));
  }, [sessions]);

  const milestones = useMemo(() => {
    const records: Record<string, { weight: number, reps: number, date: string }> = {};
    
    sessions.forEach(s => {
      const exercises = getRoutineExercisesForSession(s);
      const sessionData = s.session_data;
      
      exercises.forEach((ex) => {
        const sets = getExerciseSessionSets(sessionData, ex.id);
        sets.forEach((set: SessionSetRecord) => {
          if (set.completed && (!records[ex.name] || Number.parseFloat(set.load) > records[ex.name].weight)) {
            records[ex.name] = { 
              weight: Number.parseFloat(set.load), 
              reps: Number.parseInt(set.reps, 10), 
              date: s.start_time 
            };
          }
        });
      });
    });

    return Object.entries(records)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [sessions]);

  const userStatus =
    userStats?.daily_streak && userStats.daily_streak >= 14
      ? 'LOCKED IN'
      : frequencyData.avg >= 4
        ? 'ELITE'
        : frequencyData.avg >= 2
          ? 'PRO'
          : 'STD';

  return (
    <div className="pt-8 pb-32 lg:pb-12">
      <StatsHeader userStatus={userStatus} weeklyVolume={weeklyVolume} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
        <EvolutionChartCard charts={evolutionCharts} />
        <FrequencyCard frequencyData={frequencyData} />
        <MuscleDistributionCard muscleDistribution={muscleDistribution} />
        <SecondaryMetricsSection milestones={milestones} timeMetrics={timeMetrics} />
      </div>
    </div>
  );
}
