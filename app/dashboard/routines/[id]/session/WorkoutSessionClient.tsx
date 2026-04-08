'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { saveWorkoutSessionAction } from './actions';

interface RoutineExercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  load: number;
  rest: number;
  gifUrl?: string;
  instructions?: string[];
  target?: string;
}

interface SetRecord {
  load: string;
  reps: string;
  completed: boolean;
}

export default function WorkoutSessionClient({ routine }: { routine: any }) {
  const exercises: RoutineExercise[] = routine.exercises || [];
  
  if (exercises.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-surface text-on-surface">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">gpp_bad</span>
        <h2 className="text-3xl font-headline font-black italic mb-4">PROTOCOLO NO ENCONTRADO</h2>
        <p className="text-on-surface-variant max-w-sm mb-8">Esta rutina no tiene ejercicios configurados. Edítala primero.</p>
        <Link href={`/dashboard/routines/${routine.id}`} className="bg-primary text-on-primary-fixed px-8 py-4 rounded-xl font-bold font-headline uppercase tracking-widest active:scale-95 transition-transform">
          Volver
        </Link>
      </div>
    );
  }

  // --- Session State ---
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentEx = exercises[currentExerciseIndex];

  // We need state to track the sets for each exercise
  // Initialize with the target specs.
  const [sessionData, setSessionData] = useState<Record<string, SetRecord[]>>(() => {
    const initialState: Record<string, SetRecord[]> = {};
    exercises.forEach(ex => {
      initialState[ex.id] = Array(ex.sets).fill(null).map(() => ({
        load: ex.load > 0 ? ex.load.toString() : '',
        reps: ex.reps > 0 ? ex.reps.toString() : '',
        completed: false
      }));
    });
    return initialState;
  });

  // Track which set the user is currently editing
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  // Real DB state
  const [isPending, startTransition] = useTransition();
  const [startTime] = useState(() => new Date().toISOString());

  // Timer State
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive progress
  const currentExSets = sessionData[currentEx.id] || [];

  // Initialize active set on exercise switch
  useEffect(() => {
    const setsForEx = sessionData[currentEx.id] || [];
    const firstIncomplete = setsForEx.findIndex(s => !s.completed);
    setActiveSetIndex(firstIncomplete === -1 ? setsForEx.length - 1 : firstIncomplete);
  }, [currentExerciseIndex]);

  // Timer Tick
  useEffect(() => {
    if (isTimerActive && restTimeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setRestTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (restTimeRemaining === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timerRef.current!);
  }, [isTimerActive, restTimeRemaining]);

  const updateSetInput = (setIndex: number, field: 'load' | 'reps', value: string) => {
    setSessionData(prev => {
      const exData = [...prev[currentEx.id]];
      exData[setIndex] = { ...exData[setIndex], [field]: value };
      return { ...prev, [currentEx.id]: exData };
    });
  };

  const completeSet = (setIndex: number) => {
    setSessionData(prev => {
      const exData = [...prev[currentEx.id]];
      exData[setIndex] = { ...exData[setIndex], completed: true };
      return { ...prev, [currentEx.id]: exData };
    });

    // Automatically move to next set
    if (setIndex < currentEx.sets - 1) {
      setActiveSetIndex(setIndex + 1);
    }

    // Start rest timer
    if (currentEx.rest > 0) {
      setRestTimeRemaining(currentEx.rest);
      setIsTimerActive(true);
    }
  };

  const undoCompleteSet = (setIndex: number) => {
    setSessionData(prev => {
      const exData = [...prev[currentEx.id]];
      exData[setIndex] = { ...exData[setIndex], completed: false };
      return { ...prev, [currentEx.id]: exData };
    });
    setActiveSetIndex(setIndex);
  };

  const adjustTimer = (seconds: number) => {
    setRestTimeRemaining(prev => Math.max(0, prev + seconds));
    if (restTimeRemaining + seconds > 0) {
      setIsTimerActive(true);
    }
  };

  const finishWorkout = () => {
    startTransition(async () => {
      try {
        await saveWorkoutSessionAction(routine.id, sessionData, startTime);
        window.location.href = '/dashboard';
      } catch (e) {
        console.error(e);
      }
    });
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsTimerActive(false);
      setRestTimeRemaining(0);
    } else {
      finishWorkout();
    }
  };

  // Formatting helpers
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black text-primary italic tracking-tighter font-headline">KINETIC</span>
            <div className="h-6 w-[1px] bg-outline-variant/30 hidden md:block"></div>
            <div className="hidden md:flex gap-6">
              <span className="text-primary font-bold font-headline text-sm uppercase tracking-widest">Sesión Activa</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-on-surface-variant hover:text-error transition-colors active:scale-95 flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold">Abortar</span>
              <span className="material-symbols-outlined">close</span>
            </Link>
          </div>
        </div>
        {/* Global Progress Bar */}
        <div className="w-full h-1 bg-surface-container-highest">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-dim shadow-[0_0_8px_rgba(202,253,0,0.5)] transition-all duration-500"
            style={{ width: `${((currentExerciseIndex) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="min-h-screen pt-24 pb-32 px-4 md:px-12 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Media & Timer */}
          <div className="xl:col-span-7 space-y-8">
            {/* Exercise Title Header */}
            <div>
              <span className="text-primary font-headline font-black italic tracking-tighter text-sm uppercase">Ejercicio {currentExerciseIndex + 1} de {exercises.length} {currentEx.target && <span className="text-outline-variant">/ {currentEx.target}</span>}</span>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-white mt-1 capitalize leading-tight">{currentEx.name}</h1>
            </div>

            {/* Hero Exercise Video Card */}
            <div className="relative group rounded-[2rem] overflow-hidden bg-surface-container aspect-video shadow-2xl ring-1 ring-outline-variant/10">
              <img 
                alt="Exercise Demonstration" 
                className={`w-full h-full object-cover mix-blend-screen transition-opacity duration-1000 ${currentEx.gifUrl ? 'opacity-100' : 'opacity-40'}`} 
                src={currentEx.gifUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC3Bupu1B6jnfLeY7zbZu8rIdZ6kDlKZlrRic8w3CBZ1B_KvZjpFM2xm2wRwpghXNkLmbKo28da2xepsc_z8AViCDiAplb_6jNVnxCjeyeBAcrVnsi-ZRGmkzGj5AIl6AoqLOCgirXi0VSwtu9R_Ei20YVPHWRco1FLPu00q-9tmyLtf4sVKYpLfYB4Vvq8LpIHq5nDng1ZAYpgfKw78fUH4wOQYEF_atAfpsvEt1mc8XpfT_o_8P-QKt7esXK112abYxrcvU9EjQ"}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Instructions */}
            {currentEx.instructions && currentEx.instructions.length > 0 && (
              <div className="bg-surface-container-low rounded-[2rem] p-6 md:p-8 border border-outline-variant/5">
                <h4 className="text-white font-headline font-bold mb-4 flex gap-2 items-center tracking-wide">
                  <span className="material-symbols-outlined text-primary">psychology</span> 
                  Técnica de Ejecución
                </h4>
                <ol className="space-y-4 pl-4 list-decimal marker:text-primary marker:font-black">
                  {currentEx.instructions.map((step, i) => (
                    <li key={i} className="text-on-surface-variant text-sm leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            )}
            {/* Rest Timer Section */}
            <div className="flex flex-col gap-4">
              <div className={`rounded-[2rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group transition-colors duration-500 ${isTimerActive ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <span className={`material-symbols-outlined text-6xl ${isTimerActive ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>timer</span>
                </div>
                <span className={`font-headline text-xs uppercase tracking-[0.3em] mb-2 ${isTimerActive ? 'text-on-primary-container opacity-80' : 'text-on-surface-variant'}`}>Temporizador de Descanso</span>
                <div className={`text-6xl md:text-8xl font-headline font-black tracking-tighter tabular-nums ${isTimerActive ? 'text-on-primary-container' : 'text-white'}`}>
                  {formatTime(restTimeRemaining)}
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => adjustTimer(-30)} className={`px-6 py-3 rounded-full border text-xs font-black transition-all uppercase tracking-widest ${isTimerActive ? 'border-on-primary-container/20 hover:bg-black/10' : 'border-outline-variant/30 hover:bg-white/5'}`}>-30s</button>
                  <button onClick={() => adjustTimer(+30)} className={`px-6 py-3 rounded-full border text-xs font-black transition-all uppercase tracking-widest ${isTimerActive ? 'border-on-primary-container/20 hover:bg-black/10' : 'border-outline-variant/30 hover:bg-white/5'}`}>+30s</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking & Sets */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-surface-container rounded-[2rem] p-4 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-bold text-white">Progreso</h3>
                <span className="text-[10px] md:text-xs text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full font-bold uppercase tracking-widest">Series 1-{currentEx.sets}</span>
              </div>

              {/* Sets List */}
              <div className="space-y-4">
                {currentExSets.map((set, idx) => {
                  const isCompleted = set.completed;
                  const isCurrent = activeSetIndex === idx && !isCompleted;
                  const isInactive = activeSetIndex !== idx && !isCompleted;

                  if (isCompleted) {
                    return (
                      <div key={idx} className="group flex items-center gap-2 md:gap-4 bg-surface-container-low p-4 rounded-2xl border border-primary/20">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">{idx + 1}</div>
                        <div className="grid grid-cols-2 flex-1 gap-4">
                          <div className="relative">
                            <input 
                              type="text" 
                              value={set.load}
                              readOnly
                              className="w-full bg-surface-container-lowest border-none text-white/50 font-bold text-center rounded-xl py-3 focus:ring-0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-bold uppercase">kg</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={set.reps}
                              readOnly
                              className="w-full bg-surface-container-lowest border-none text-white/50 font-bold text-center rounded-xl py-3 focus:ring-0" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-bold uppercase">reps</span>
                          </div>
                        </div>
                        <button onClick={() => undoCompleteSet(idx)} className="w-12 h-12 shrink-0 rounded-xl bg-primary text-on-primary-fixed flex items-center justify-center transition-transform active:scale-90">
                          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                        </button>
                      </div>
                    )
                  }

                  if (isCurrent) {
                    return (
                      <div key={idx} className="group flex items-center gap-2 md:gap-4 bg-surface-container-high p-4 rounded-2xl shadow-xl transition-all border border-outline-variant/30">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-surface-variant flex items-center justify-center text-white font-black text-sm">{idx + 1}</div>
                        <div className="grid grid-cols-2 flex-1 gap-4">
                          <div className="relative">
                            <input 
                              type="text"
                              value={set.load}
                              onChange={(e) => updateSetInput(idx, 'load', e.target.value)}
                              className="w-full bg-surface-container-lowest border-none text-white font-bold text-center rounded-xl py-3 focus:ring-2 focus:ring-primary-dim/20 transition-all placeholder:text-on-surface-variant/30 outline-none" 
                              placeholder={currentEx.load > 0 ? currentEx.load.toString() : "0"} 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-bold uppercase">kg</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="text"
                              value={set.reps}
                              onChange={(e) => updateSetInput(idx, 'reps', e.target.value)}
                              className="w-full bg-surface-container-lowest border-none text-white font-bold text-center rounded-xl py-3 focus:ring-2 focus:ring-primary-dim/20 transition-all placeholder:text-on-surface-variant/30 outline-none" 
                              placeholder={currentEx.reps.toString()}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-bold uppercase">reps</span>
                          </div>
                        </div>
                        <button onClick={() => completeSet(idx)} className="w-12 h-12 shrink-0 rounded-xl bg-surface-variant text-on-surface-variant flex items-center justify-center hover:bg-primary hover:text-on-primary-fixed transition-all active:scale-90">
                          <span className="material-symbols-outlined">check_circle</span>
                        </button>
                      </div>
                    )
                  }

                  if (isInactive) {
                    return (
                      <div key={idx} onClick={() => setActiveSetIndex(idx)} className="group flex items-center gap-2 md:gap-4 opacity-40 p-4 rounded-2xl grayscale transition-all hover:grayscale-0 hover:opacity-100 cursor-pointer">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-surface-variant flex items-center justify-center text-white font-black text-sm">{idx + 1}</div>
                        <div className="grid grid-cols-2 flex-1 gap-4">
                          <div className="bg-surface-container-lowest rounded-xl py-3 text-center text-on-surface-variant font-bold text-sm">--</div>
                          <div className="bg-surface-container-lowest rounded-xl py-3 text-center text-on-surface-variant font-bold text-sm">--</div>
                        </div>
                        <button className="w-12 h-12 shrink-0 rounded-xl bg-surface-variant text-on-surface-variant flex items-center justify-center">
                          <span className="material-symbols-outlined">radio_button_unchecked</span>
                        </button>
                      </div>
                    )
                  }
                })}
              </div>

              <div className="mt-12 flex flex-col gap-4">
                <button onClick={nextExercise} disabled={isPending} className="w-full py-5 bg-primary-container hover:bg-primary transition-colors text-on-primary-fixed text-sm md:text-lg font-black font-headline uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] shadow-[0_20px_40px_rgba(0,0,0,0.4)] disabled:opacity-50">
                  {isPending ? 'Guardando Sesión...' : (currentExerciseIndex === exercises.length - 1 ? 'Finalizar Entrenamiento' : 'Siguiente Ejercicio')}
                  {!isPending && <span className="material-symbols-outlined">{currentExerciseIndex === exercises.length - 1 ? 'done_all' : 'arrow_forward'}</span>}
                </button>
                <button onClick={finishWorkout} disabled={isPending} className="w-full py-4 border border-outline-variant/15 text-center text-on-surface-variant hover:text-white font-bold text-[10px] md:text-sm uppercase tracking-widest rounded-2xl transition-colors block disabled:opacity-50">
                  Finalizar Entrenamiento Anticipadamente
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </main>

    </>
  );
}
