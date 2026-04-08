'use client';

import { useState, useMemo } from 'react';

interface HistoryClientProps {
  initialSessions: any[];
}

export default function HistoryClient({ initialSessions }: HistoryClientProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('30_DAYS');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Filter logic
  const filteredSessions = useMemo(() => {
    let sessions = initialSessions;

    // Type Filter
    if (typeFilter !== 'ALL') {
      sessions = sessions.filter(s => s.routines?.goal === typeFilter || s.routines?.difficulty === typeFilter);
    }

    // Date Filter
    if (selectedDay) {
      sessions = sessions.filter(s => {
        const sDate = new Date(s.start_time);
        return sDate.getDate() === selectedDay.getDate() && 
               sDate.getMonth() === selectedDay.getMonth() && 
               sDate.getFullYear() === selectedDay.getFullYear();
      });
    } else {
      const now = new Date();
      if (dateFilter === '7_DAYS') {
        const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        sessions = sessions.filter(s => new Date(s.start_time) >= limit);
      } else if (dateFilter === '30_DAYS') {
        const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        sessions = sessions.filter(s => new Date(s.start_time) >= limit);
      } else if (dateFilter === '90_DAYS') {
        const limit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        sessions = sessions.filter(s => new Date(s.start_time) >= limit);
      }
    }

    return sessions;
  }, [initialSessions, dateFilter, typeFilter, selectedDay]);

  // Calendar logic
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [currentMonth]);

  const hasSessionOnDay = (day: Date) => {
    return initialSessions.some(s => {
      const sDate = new Date(s.start_time);
      return sDate.getDate() === day.getDate() && 
             sDate.getMonth() === day.getMonth() && 
             sDate.getFullYear() === day.getFullYear();
    });
  };

  const getSessionTypeOnDay = (day: Date) => {
    const session = initialSessions.find(s => {
      const sDate = new Date(s.start_time);
      return sDate.getDate() === day.getDate() && 
             sDate.getMonth() === day.getMonth() && 
             sDate.getFullYear() === day.getFullYear();
    });
    if (!session) return null;
    return session.routines?.goal?.toLowerCase().includes('cardio') ? 'cardio' : 'strength';
  };

  const toggleExpand = (id: string) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  const handleDayClick = (day: Date) => {
    if (selectedDay && day.toDateString() === selectedDay.toDateString()) {
      setSelectedDay(null);
    } else {
      setSelectedDay(new Date(day));
    }
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
  };

  const formatDateLabel = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(date));
  };

  const formatTimeLabel = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(date));
  };

  return (
    <div className="pt-8 pb-32 lg:pb-12">
      {/* Hero Header */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div>
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Bitácora de Rendimiento</span>
          <h2 className="text-5xl md:text-6xl font-black font-headline mt-2 leading-none italic uppercase text-white">
            ARCHIVO<span className="text-primary/50">.HTAL</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-surface-container-high px-6 py-4 rounded-2xl border border-outline-variant/10 text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-all cursor-pointer outline-none focus:ring-1 focus:ring-primary/20 text-white"
            >
              <option value="7_DAYS">Últimos 7 días</option>
              <option value="30_DAYS">Últimos 30 días</option>
              <option value="90_DAYS">Últimos 90 días</option>
              <option value="ALL">Todo el Historial</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
          
          <div className="relative group">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-surface-container-high px-6 py-4 rounded-2xl border border-outline-variant/10 text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-all cursor-pointer outline-none focus:ring-1 focus:ring-primary/20 pr-12 text-white"
            >
              <option value="ALL">Tipo de Rutina</option>
              <option value="Strength">Fuerza / Hipertrofia</option>
              <option value="Cardio">Cardiovascular</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4 md:px-0">
        
        {/* Sidebar: Calendar View */}
        <aside className="xl:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-headline font-black text-xl italic uppercase tracking-tighter text-white">Calendario</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-[#cafd00] capitalize">
                {formatMonth(currentMonth)}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-on-surface-variant uppercase mb-6 opacity-40">
              <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
              {daysInMonth.map((day, idx) => {
                const hasSession = hasSessionOnDay(day);
                const type = getSessionTypeOnDay(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = selectedDay && day.toDateString() === selectedDay.toDateString();
                
                return (
                  <button 
                    key={idx} 
                    onClick={() => handleDayClick(day)}
                    className="relative flex flex-col items-center group outline-none"
                  >
                    <div className={`
                      w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                      ${isSelected 
                        ? 'bg-primary text-on-primary-fixed shadow-[0_0_15px_rgba(202,253,0,0.4)] scale-110 z-10' 
                        : (hasSession 
                          ? (type === 'cardio' ? 'bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30' : 'bg-primary-container/20 text-primary border border-primary/30 hover:bg-primary/30') 
                          : 'hover:bg-surface-container text-on-surface-variant/50')}
                      ${isToday && !hasSession && !isSelected ? 'border border-primary/20 text-white' : ''}
                    `}>
                      {day.getDate()}
                    </div>
                    {hasSession && !isSelected && (
                      <div className={`mt-1 w-1 h-1 rounded-full ${type === 'cardio' ? 'bg-secondary shadow-[0_0_8px_rgba(0,112,235,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(202,253,0,0.5)]'}`}></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-outline-variant/5">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(202,253,0,0.5)]"></div> Entrenamientos Fuerza
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-3">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,112,235,0.5)]"></div> Entrenamientos Cardio
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
            {selectedDay && (
              <button 
                onClick={() => setSelectedDay(null)}
                className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:text-white transition-colors"
              >
                Limpiar <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
            <h4 className="font-headline font-black text-sm uppercase tracking-[0.2em] mb-8 text-on-surface-variant">
              {selectedDay ? 'Registro del Día' : 'Resumen de Periodo'}
            </h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sesiones Totales</span>
                <span className="text-3xl font-headline font-black text-white">{filteredSessions.length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Volumen Total</span>
                <span className="text-3xl font-headline font-black text-primary italic">---<span className="text-xs ml-1 not-italic">kg</span></span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main List: Workout Sessions */}
        <div className="xl:col-span-8 space-y-6">
          {filteredSessions.length === 0 ? (
            <div className="bg-surface-container rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center border border-dashed border-outline-variant/20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-6 font-thin">history_edu</span>
              <h3 className="text-2xl font-headline font-bold text-on-surface-variant/40 italic uppercase tracking-tighter">Sin registros detectados</h3>
              <p className="text-on-surface-variant/30 text-sm mt-2 font-medium">Completa tu primer entrenamiento para iniciar el archivo.</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isExpanded = expandedSession === session.id;
              const routine = session.routines || {};
              const exercises = routine.exercises || [];
              const sessionData = session.session_data || {};

              return (
                <article 
                  key={session.id} 
                  className={`
                    group bg-surface-container-high border border-outline-variant/5 rounded-[2.5rem] overflow-hidden transition-all duration-500
                    ${isExpanded ? 'shadow-2xl ring-1 ring-primary/10' : 'hover:bg-surface-variant/50 cursor-pointer'}
                  `}
                  onClick={() => !isExpanded && toggleExpand(session.id)}
                >
                  <div className="p-8 md:p-10 flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex gap-8 items-start">
                      <div className={`
                        w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0
                        ${routine.goal?.toLowerCase().includes('cardio') ? 'bg-secondary/20 text-secondary' : 'bg-primary-container text-on-primary-fixed'}
                        shadow-lg
                      `}>
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {routine.goal?.toLowerCase().includes('cardio') ? 'bolt' : 'fitness_center'}
                        </span>
                      </div>
                      <div>
                        <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] mb-2 scale-y-90 origin-left">
                          {formatDateLabel(session.start_time)} • {formatTimeLabel(session.start_time)}
                        </p>
                        <h4 className="text-2xl md:text-3xl font-black font-headline tracking-tighter italic uppercase group-hover:text-primary transition-colors text-white">
                          {routine.title || 'Sesión de Entrenamiento'}
                        </h4>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <span className="bg-surface-container shadow-inner px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-on-surface-variant border border-outline-variant/10">
                            {routine.goal || 'General'}
                          </span>
                          <span className="bg-surface-container shadow-inner px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#cafd00] border border-primary/10">
                            {routine.difficulty || 'Media'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 lg:border-l lg:border-outline-variant/10 lg:pl-10">
                      <div className="text-center min-w-[80px]">
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest mb-2 opacity-50">Intensidad</p>
                        <p className="text-2xl font-black font-headline text-white italic">
                          {routine.difficulty === 'Alta' ? 'ELITE' : 'STD'}
                        </p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest mb-2 opacity-50">Estado</p>
                        <p className="text-2xl font-black font-headline text-primary">OK</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(session.id);
                        }}
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                          ${isExpanded ? 'bg-primary text-on-primary-fixed rotate-180' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright'}
                        `}
                      >
                        <span className="material-symbols-outlined text-2xl">keyboard_arrow_down</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Session Details */}
                  {isExpanded && (
                    <div className="bg-surface-container-low/40 px-8 pb-10 pt-2 border-t border-outline-variant/5 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 mt-2">
                        <div>
                          <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-primary"></span> Movimientos Base
                          </h5>
                          <ul className="space-y-5">
                            {exercises.slice(0, 2).map((ex: any) => {
                              const sets = sessionData[ex.id] || [];
                              const completedSets = sets.filter((s: any) => s.completed);
                              const bestSet = completedSets.reduce((best: any, current: any) => {
                                if (!best || parseInt(current.load) > parseInt(best.load)) return current;
                                return best;
                              }, null);

                              return (
                                <li key={ex.id} className="flex justify-between items-center group/ex p-4 rounded-2xl hover:bg-surface-container-high/50 transition-colors">
                                  <div>
                                    <p className="font-bold text-sm text-white group-hover/ex:text-primary transition-colors">{ex.name}</p>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                                      {completedSets.length} de {ex.sets} Series completas
                                    </p>
                                  </div>
                                  {bestSet && (
                                    <div className="text-right">
                                      <p className="font-black text-sm text-white">{bestSet.load}kg × {bestSet.reps}</p>
                                      <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Mejor Registro</p>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-white"></span> Complementarios
                          </h5>
                          <ul className="space-y-5">
                            {exercises.slice(2).map((ex: any) => {
                              const sets = sessionData[ex.id] || [];
                              const completedSets = sets.filter((s: any) => s.completed);

                              return (
                                <li key={ex.id} className="flex justify-between items-center p-4 rounded-2xl hover:bg-surface-container-high/50 transition-colors">
                                  <div>
                                    <p className="font-bold text-sm text-white">{ex.name}</p>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                                      {completedSets.length} Series finalizadas
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] font-black text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
                                      {ex.reps} REPS × {ex.load}KG
                                    </span>
                                  </div>
                                </li>
                              );
                            })}
                            {exercises.length <= 2 && (
                              <p className="text-[10px] text-on-surface-variant italic py-4">Sin ejercicios complementarios en esta rutina.</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
