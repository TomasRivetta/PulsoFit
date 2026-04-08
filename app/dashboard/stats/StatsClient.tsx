'use client';

import { useMemo } from 'react';

interface StatsClientProps {
  userStats: any;
  sessions: any[];
}

export default function StatsClient({ userStats, sessions }: StatsClientProps) {
  
  // Time Windows
  const timeMetrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const currMonthSessions = sessions.filter(s => new Date(s.start_time) >= thirtyDaysAgo);
    const prevMonthSessions = sessions.filter(s => {
      const d = new Date(s.start_time);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    });

    const calculateVolume = (sess: any[]) => sess.reduce((total, s) => {
      const data = s.session_data || {};
      let sessionVol = 0;
      Object.values(data).forEach((sets: any) => {
        sets.forEach((set: any) => {
          if (set.completed) sessionVol += (parseFloat(set.load) || 0) * (parseInt(set.reps) || 0);
        });
      });
      return total + sessionVol;
    }, 0);

    const calculateAvgDuration = (sess: any[]) => {
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

  // Calculate Weekly Volume (Sum of all sets * reps * load for the last 7 days)
  const weeklyVolume = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return sessions
      .filter(s => new Date(s.start_time) >= oneWeekAgo)
      .reduce((total, s) => {
        const data = s.session_data || {};
        let sessionVol = 0;
        Object.values(data).forEach((sets: any) => {
          sets.forEach((set: any) => {
            if (set.completed) {
              sessionVol += (parseFloat(set.load) || 0) * (parseInt(set.reps) || 0);
            }
          });
        });
        return total + sessionVol;
      }, 0);
  }, [sessions]);

  // Frequency Data (Sessions per week for last 5 weeks)
  const frequencyData = useMemo(() => {
    const now = new Date();
    const weeks = [0, 0, 0, 0, 0]; // Last 5 weeks
    
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

  // Muscle Group Volume (Legs, Back, Chest, Core)
  const muscleDistribution = useMemo(() => {
    const counts = { Legs: 0, Back: 0, Chest: 0, Core: 0 };
    
    sessions.forEach(s => {
      const exercises = s.routines?.exercises || [];
      const sessionData = s.session_data || {};
      
      exercises.forEach((ex: any) => {
        const sets = sessionData[ex.id] || [];
        const completedCount = sets.filter((set: any) => set.completed).length;
        
        const target = (ex.target || '').toLowerCase();
        if (target.includes('leg') || target.includes('quad') || target.includes('ham') || target.includes('glute')) counts.Legs += completedCount;
        else if (target.includes('back') || target.includes('lats') || target.includes('traps')) counts.Back += completedCount;
        else if (target.includes('chest') || target.includes('pecs')) counts.Chest += completedCount;
        else if (target.includes('abs') || target.includes('core') || target.includes('oblique')) counts.Core += completedCount;
      });
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const maxVal = Math.max(...Object.values(counts), 1);
    
    // Determine dominant group
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

  // Weight Evolution Data (Dynamic Chart generation)
  const evolutionCharts = useMemo(() => {
    const exerciseLoads: Record<string, { date: number, load: number }[]> = {};
    
    sessions.forEach(s => {
      const date = new Date(s.start_time).getTime();
      const routine = s.routines || {};
      const data = s.session_data || {};
      
      (routine.exercises || []).forEach((ex: any) => {
        const sets = data[ex.id] || [];
        const maxLoad = Math.max(...sets.map((set: any) => set.completed ? parseFloat(set.load) || 0 : 0), 0);
        if (maxLoad > 0) {
          if (!exerciseLoads[ex.name]) exerciseLoads[ex.name] = [];
          exerciseLoads[ex.name].push({ date, load: maxLoad });
        }
      });
    });

    // Top 2 exercises by points
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

  // Milestones (Top weights per exercise)
  const milestones = useMemo(() => {
    const records: Record<string, { weight: number, reps: number, date: string }> = {};
    
    sessions.forEach(s => {
      const exercises = s.routines?.exercises || [];
      const sessionData = s.session_data || {};
      
      exercises.forEach((ex: any) => {
        const sets = sessionData[ex.id] || [];
        sets.forEach((set: any) => {
          if (set.completed && (!records[ex.name] || parseFloat(set.load) > records[ex.name].weight)) {
            records[ex.name] = { 
              weight: parseFloat(set.load), 
              reps: parseInt(set.reps), 
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

  return (
    <div className="pt-8 pb-32 lg:pb-12">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter mb-2 italic uppercase text-white">
            ANÁLISIS DE<br/><span className="text-primary">RENDIMIENTO</span>
          </h1>
          <p className="text-on-surface-variant font-medium max-w-md">Explora tu evolución fisiológica y potencia mecánica de los últimos 90 días.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container px-6 py-4 rounded-2xl border border-outline-variant/10 shadow-xl">
            <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Volumen Semanal</div>
            <div className="text-3xl font-headline font-black text-white">
              {weeklyVolume.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant not-italic">kg</span>
            </div>
          </div>
          <div className="bg-surface-container-high px-6 py-4 rounded-2xl border-l-4 border-secondary shadow-xl">
            <div className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">Status de Usuario</div>
            <div className="text-3xl font-headline font-black text-white">
              {frequencyData.avg >= 4 ? 'ELITE' : frequencyData.avg >= 2 ? 'PRO' : 'STD'}
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
        
        {/* Weight Evolution Chart */}
        <div className="md:col-span-8 bg-surface-container p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/5 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-2xl font-headline font-black italic uppercase tracking-tighter text-white">Evolución de Carga</h3>
              <p className="text-on-surface-variant text-sm font-medium">Levantamientos principales (Ventana de 3 meses)</p>
            </div>
            <div className="flex gap-2">
              {evolutionCharts.map((chart, i) => (
                <span key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/10 text-white leading-none">
                  <span className={`w-2 h-2 rounded-full shadow-lg ${i === 0 ? 'bg-primary shadow-primary/30' : 'bg-secondary shadow-secondary/30'}`}></span> {chart.name}
                </span>
              ))}
              {evolutionCharts.length === 0 && (
                <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Sin datos de carga</span>
              )}
            </div>
          </div>
          
          {/* SVG Line Chart */}
          <div className="h-64 mt-8 relative">
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-outline-variant/5"></div>
              <div className="w-full border-t border-outline-variant/5"></div>
              <div className="w-full border-t border-outline-variant/5"></div>
              <div className="w-full border-t border-outline-variant/5"></div>
            </div>
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="chartGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(202,253,0,0.2)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(202,253,0,0)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              {evolutionCharts.map((chart, i) => (
                <g key={i}>
                  <path 
                    d={chart.path} 
                    fill="none" 
                    stroke={i === 0 ? "#cafd00" : "#679cff"} 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeDasharray={i === 1 ? "8 4" : "0"}
                    className={i === 1 ? "opacity-60" : ""}
                  />
                  {i === 0 && chart.path && (
                    <path 
                      d={`${chart.path} L1000,200 L0,200 Z`} 
                      fill="url(#chartGrad)" 
                    />
                  )}
                </g>
              ))}
              
              {evolutionCharts.length === 0 && (
                <text x="500" y="100" textAnchor="middle" className="fill-on-surface-variant/20 font-black italic uppercase text-2xl tracking-tighter">
                  DATOS INSUFICIENTES.EXE
                </text>
              )}
            </svg>
            <div className="flex justify-between mt-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">
              <span>OCT</span><span>NOV</span><span>DIC</span><span>ENE</span>
            </div>
          </div>
        </div>

        {/* Training Frequency */}
        <div className="md:col-span-4 bg-surface-container p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/5 shadow-2xl flex flex-col">
          <h3 className="text-2xl font-headline font-black italic uppercase tracking-tighter text-white mb-8">Frecuencia</h3>
          <div className="flex-1 flex items-end justify-between gap-3 px-2">
            {frequencyData.weeks.map((count, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-xl relative group transition-all duration-500 ${i === 4 ? 'bg-primary shadow-[0_0_30px_rgba(202,253,0,0.3)]' : 'bg-surface-container-high hover:bg-primary/20'}`}
                style={{ height: `${Math.max(15, (count / 7) * 100)}%` }}
              >
                <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-on-primary-fixed px-3 py-1 rounded-lg text-[10px] font-black italic shadow-xl ${i === 4 ? 'opacity-100 !-translate-y-1' : ''}`}>
                  {i === 4 ? 'ELITE' : `${count}d`}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
            <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Promedio sesiones/sem</span>
            <span className="text-3xl font-headline font-black text-white italic">{frequencyData.avg.toFixed(1)}</span>
          </div>
        </div>

        {/* Volume Radar Chart */}
        <div className="md:col-span-5 bg-surface-container-high p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl flex flex-col gap-10">
          <div>
            <h3 className="text-2xl font-headline font-black italic uppercase tracking-tighter text-white mb-2">Distribución Muscular</h3>
            <p className="text-on-surface-variant text-sm font-medium">Volumen de trabajo relativo por categoría</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative scale-110">
            {/* Background Spiders */}
            <div className="absolute w-44 h-44 rounded-full border border-outline-variant/10 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-outline-variant/10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-outline-variant/10"></div>
              </div>
            </div>
            {/* Radar Lines */}
            <div className="absolute h-44 w-[1px] bg-outline-variant/20"></div>
            <div className="absolute w-44 h-[1px] bg-outline-variant/20"></div>

            {/* Labels */}
            <span className="absolute -top-6 text-[10px] font-black uppercase tracking-widest text-[#cafd00]">Piernas</span>
            <span className="absolute -bottom-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Espalda</span>
            <span className="absolute -left-10 -rotate-90 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Pecho</span>
            <span className="absolute -right-10 rotate-90 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Core</span>

            {/* Radar Polygon */}
            <svg className="absolute w-44 h-44" viewBox="0 0 100 100">
              <polygon 
                fill="rgba(103,156,255,0.4)" 
                stroke="#679cff" 
                strokeWidth="3" 
                points={`50,${50 - muscleDistribution.Legs / 2} ${50 + muscleDistribution.Core / 2},50 50,${50 + muscleDistribution.Back / 2} ${50 - muscleDistribution.Chest / 2},50`}
                className="drop-shadow-[0_0_10px_rgba(103,156,255,0.5)]"
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/5">
              <div className="text-[9px] text-secondary font-black uppercase tracking-widest mb-2">Dominante</div>
              <div className="text-lg font-headline font-black italic text-white uppercase">{muscleDistribution.dominant === 'Legs' ? 'Tren Inferior' : muscleDistribution.dominant === 'Back' ? 'Cadena Posterior' : muscleDistribution.dominant === 'Chest' ? 'Cadena Anterior' : 'Core Stability'}</div>
            </div>
            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/5">
              <div className="text-[9px] text-primary-dim font-black uppercase tracking-widest mb-2">Enfoque</div>
              <div className="text-lg font-headline font-black italic text-white uppercase">{muscleDistribution.focus}</div>
            </div>
          </div>
        </div>

        {/* Secondary Metric Cards */}
        <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/5 shadow-xl relative overflow-hidden group hover:ring-1 hover:ring-primary/20 transition-all">
            <div className="flex justify-between mb-10">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">trending_up</span>
              </div>
              <div className="text-right">
                <div className="text-on-surface-variant text-[9px] font-black uppercase tracking-widest mb-1">vs Mes Pasado</div>
                <div className={`${timeMetrics.volChange >= 0 ? 'text-primary' : 'text-red-400'} font-black italic text-lg`}>
                  {timeMetrics.volChange >= 0 ? '+' : ''}{timeMetrics.volChange.toFixed(1)}%
                </div>
              </div>
            </div>
            <h4 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">Índice de Fuerza</h4>
            <div className="text-5xl font-headline font-black text-white italic">{timeMetrics.strengthIndex}<span className="text-base font-normal text-on-surface-variant ml-2 not-italic lowercase">kN</span></div>
          </div>

          <div className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/5 shadow-xl relative overflow-hidden group hover:ring-1 hover:ring-secondary/20 transition-all">
            <div className="flex justify-between mb-10">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">timer</span>
              </div>
              <div className="text-right">
                <div className="text-on-surface-variant text-[9px] font-black uppercase tracking-widest mb-1">Tendencia</div>
                <div className={`${timeMetrics.durTrend <= 0 ? 'text-secondary' : 'text-primary'} font-black italic text-lg`}>
                  {timeMetrics.durTrend <= 0 ? '' : '+'}{timeMetrics.durTrend.toFixed(0)}m avg
                </div>
              </div>
            </div>
            <h4 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">Duración Med. Sesión</h4>
            <div className="text-5xl font-headline font-black text-white italic">{timeMetrics.avgDuration.toFixed(0)}<span className="text-base font-normal text-on-surface-variant ml-2 not-italic lowercase">min</span></div>
          </div>

          {/* Recent Milestones Table */}
          <div className="md:col-span-2 bg-surface-container p-10 rounded-[2.5rem] border border-outline-variant/5 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-headline font-black italic uppercase tracking-tighter text-white">Hitos Recientes</h3>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-4 py-2 bg-primary/5 rounded-full">Ver Todos</button>
            </div>
            <div className="space-y-2">
              {milestones.length === 0 ? (
                <p className="text-on-surface-variant text-sm italic py-8 text-center opacity-40">Entrena para registrar tus primeros hitos.</p>
              ) : (
                milestones.map((ms, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-high/50 transition-colors border-b border-outline-variant/5 last:border-0 group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-surface-container-high rounded-[1rem] flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                      </div>
                      <div>
                        <div className="font-black text-white uppercase tracking-tight text-sm">{ms.name}</div>
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Nuevo récord personal</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-primary italic text-lg">{ms.weight} kg</div>
                      <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">
                        {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(ms.date))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
