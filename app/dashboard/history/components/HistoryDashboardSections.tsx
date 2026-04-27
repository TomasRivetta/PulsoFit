import {
  getExerciseSessionSets,
  getRoutineExercisesForSession,
  type SessionSetRecord,
  type WorkoutSessionWithRoutine,
} from '@/lib/domain/workout-sessions';

interface HistoryFiltersHeaderProps {
  dateFilter: string;
  typeFilter: string;
  onDateFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export function HistoryFiltersHeader({
  dateFilter,
  typeFilter,
  onDateFilterChange,
  onTypeFilterChange,
}: HistoryFiltersHeaderProps) {
  return (
    <section className="mb-12 flex flex-col justify-between gap-6 px-4 md:flex-row md:items-end md:px-0">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Bitácora de Rendimiento</span>
        <h2 className="mt-2 text-5xl font-headline font-black uppercase leading-none italic text-white md:text-6xl">
          ARCHIVO<span className="text-primary/50">.HTAL</span>
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="group relative">
          <select
            value={dateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
            className="cursor-pointer appearance-none rounded-2xl border border-outline-variant/10 bg-surface-container-high px-6 py-4 text-sm font-bold text-white outline-none transition-all hover:bg-surface-variant focus:ring-1 focus:ring-primary/20"
          >
            <option value="7_DAYS">Últimos 7 días</option>
            <option value="30_DAYS">Últimos 30 días</option>
            <option value="90_DAYS">Últimos 90 días</option>
            <option value="ALL">Todo el Historial</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-hover:text-primary">
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
        </div>

        <div className="group relative">
          <select
            value={typeFilter}
            onChange={(event) => onTypeFilterChange(event.target.value)}
            className="cursor-pointer appearance-none rounded-2xl border border-outline-variant/10 bg-surface-container-high px-6 py-4 pr-12 text-sm font-bold text-white outline-none transition-all hover:bg-surface-variant focus:ring-1 focus:ring-primary/20"
          >
            <option value="ALL">Tipo de Rutina</option>
            <option value="Strength">Fuerza / Hipertrofia</option>
            <option value="Cardio">Cardiovascular</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-hover:text-primary">
            <span className="material-symbols-outlined text-sm">filter_list</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface HistorySidebarProps {
  currentMonth: Date;
  daysInMonth: Date[];
  filteredSessionsCount: number;
  hasSessionOnDay: (day: Date) => boolean;
  formatMonth: (date: Date) => string;
  getSessionTypeOnDay: (day: Date) => 'cardio' | 'strength' | null;
  onClearSelectedDay: () => void;
  onDayClick: (day: Date) => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  selectedDay: Date | null;
}

export function HistorySidebar({
  currentMonth,
  daysInMonth,
  filteredSessionsCount,
  hasSessionOnDay,
  formatMonth,
  getSessionTypeOnDay,
  onClearSelectedDay,
  onDayClick,
  onNextMonth,
  onPreviousMonth,
  selectedDay,
}: HistorySidebarProps) {
  return (
    <aside className="space-y-8 xl:col-span-4">
      <div className="rounded-[2.5rem] border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-2xl md:p-10">
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-xl font-headline font-black uppercase tracking-tighter italic text-white">Calendario</h3>
          <div className="flex gap-2">
            <button
              onClick={onPreviousMonth}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all hover:bg-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={onNextMonth}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all hover:bg-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="mb-6 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#cafd00] capitalize">
            {formatMonth(currentMonth)}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase text-on-surface-variant opacity-40">
          <span>L</span>
          <span>M</span>
          <span>M</span>
          <span>J</span>
          <span>V</span>
          <span>S</span>
          <span>D</span>
        </div>

        <div className="grid grid-cols-7 gap-x-2 gap-y-4">
          {daysInMonth.map((day) => {
            const hasSession = hasSessionOnDay(day);
            const type = getSessionTypeOnDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDay?.toDateString() === day.toDateString();

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDayClick(day)}
                className="group relative flex flex-col items-center outline-none"
              >
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all
                    ${
                      isSelected
                        ? 'z-10 scale-110 bg-primary text-on-primary-fixed shadow-[0_0_15px_rgba(202,253,0,0.4)]'
                        : hasSession
                          ? type === 'cardio'
                            ? 'border border-secondary/30 bg-secondary/20 text-secondary hover:bg-secondary/30'
                            : 'border border-primary/30 bg-primary-container/20 text-primary hover:bg-primary/30'
                          : 'text-on-surface-variant/50 hover:bg-surface-container'
                    }
                    ${isToday && !hasSession && !isSelected ? 'border border-primary/20 text-white' : ''}
                  `}
                >
                  {day.getDate()}
                </div>
                {hasSession && !isSelected && (
                  <div
                    className={`mt-1 h-1 w-1 rounded-full ${
                      type === 'cardio'
                        ? 'bg-secondary shadow-[0_0_8px_rgba(0,112,235,0.5)]'
                        : 'bg-primary shadow-[0_0_8px_rgba(202,253,0,0.5)]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-12 border-t border-outline-variant/5 pt-8">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(202,253,0,0.5)]" />
            Entrenamientos Fuerza
          </div>
          <div className="mt-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,112,235,0.5)]" />
            Entrenamientos Cardio
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-outline-variant/10 bg-gradient-to-br from-surface-container to-surface-container-high p-10 shadow-2xl">
        {selectedDay && (
          <button
            onClick={onClearSelectedDay}
            className="absolute right-4 top-4 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary transition-colors hover:text-white"
          >
            Limpiar <span className="material-symbols-outlined text-xs">close</span>
          </button>
        )}
        <h4 className="mb-8 text-sm font-headline font-black uppercase tracking-[0.2em] text-on-surface-variant">
          {selectedDay ? 'Registro del Día' : 'Resumen de Periodo'}
        </h4>
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Sesiones Totales
            </span>
            <span className="text-3xl font-headline font-black text-white">{filteredSessionsCount}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Volumen Total</span>
            <span className="text-3xl font-headline font-black italic text-primary">
              ---<span className="ml-1 text-xs not-italic">kg</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function EmptyHistoryState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-outline-variant/20 bg-surface-container p-20 text-center">
      <span className="material-symbols-outlined mb-6 text-6xl font-thin text-on-surface-variant/20">
        history_edu
      </span>
      <h3 className="text-2xl font-headline font-bold uppercase tracking-tighter italic text-on-surface-variant/40">
        Sin registros detectados
      </h3>
      <p className="mt-2 text-sm font-medium text-on-surface-variant/30">
        Completa tu primer entrenamiento para iniciar el archivo.
      </p>
    </div>
  );
}

interface SessionHistoryCardProps {
  formatDateLabel: (date: string) => string;
  formatTimeLabel: (date: string) => string;
  isExpanded: boolean;
  onToggle: () => void;
  session: WorkoutSessionWithRoutine;
}

export function SessionHistoryCard({
  formatDateLabel,
  formatTimeLabel,
  isExpanded,
  onToggle,
  session,
}: SessionHistoryCardProps) {
  const routine = session.routines || {};
  const exercises = getRoutineExercisesForSession(session);
  const sessionData = session.session_data;
  const isCardio = routine.goal?.toLowerCase().includes('cardio');

  return (
    <article
      className={`
        group overflow-hidden rounded-[2.5rem] border border-outline-variant/5 bg-surface-container-high transition-all duration-500
        ${isExpanded ? 'shadow-2xl ring-1 ring-primary/10' : 'cursor-pointer hover:bg-surface-variant/50'}
      `}
      onClick={() => {
        if (!isExpanded) {
          onToggle();
        }
      }}
    >
      <div className="flex flex-col justify-between gap-8 p-8 md:p-10 lg:flex-row">
        <div className="flex items-start gap-8">
          <div
            className={`
              flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] shadow-lg
              ${isCardio ? 'bg-secondary/20 text-secondary' : 'bg-primary-container text-on-primary-fixed'}
            `}
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isCardio ? 'bolt' : 'fitness_center'}
            </span>
          </div>
          <div>
            <p className="mb-2 origin-left scale-y-90 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
              {formatDateLabel(session.start_time)} • {formatTimeLabel(session.start_time)}
            </p>
            <h4 className="text-2xl font-headline font-black uppercase tracking-tighter italic text-white transition-colors group-hover:text-primary md:text-3xl">
              {routine.title || 'Sesión de Entrenamiento'}
            </h4>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-outline-variant/10 bg-surface-container px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-on-surface-variant shadow-inner">
                {routine.goal || 'General'}
              </span>
              <span className="rounded-full border border-primary/10 bg-surface-container px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#cafd00] shadow-inner">
                {routine.difficulty || 'Media'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 lg:border-l lg:border-outline-variant/10 lg:pl-10">
          <div className="min-w-[80px] text-center">
            <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">
              Intensidad
            </p>
            <p className="text-2xl font-headline font-black italic text-white">
              {routine.difficulty === 'Alta' ? 'ELITE' : 'STD'}
            </p>
          </div>
          <div className="min-w-[80px] text-center">
            <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">
              Estado
            </p>
            <p className="text-2xl font-headline font-black text-primary">OK</p>
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            className={`
              flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300
              ${isExpanded ? 'rotate-180 bg-primary text-on-primary-fixed' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright'}
            `}
          >
            <span className="material-symbols-outlined text-2xl">keyboard_arrow_down</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-4 border-t border-outline-variant/5 bg-surface-container-low/40 px-8 pb-10 pt-2 duration-500 fade-in">
          <div className="mt-2 grid grid-cols-1 gap-10 pt-8 md:grid-cols-2">
            <div>
              <h5 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <span className="h-[1px] w-4 bg-primary" /> Movimientos Base
              </h5>
              <ul className="space-y-5">
                {exercises.slice(0, 2).map((exercise) => {
                  const sets = getExerciseSessionSets(sessionData, exercise.id);
                  const completedSets = sets.filter((set) => set.completed);
                  const bestSet = completedSets.reduce<SessionSetRecord | null>((best, current) => {
                    if (!best || Number.parseInt(current.load, 10) > Number.parseInt(best.load, 10)) {
                      return current;
                    }

                    return best;
                  }, null);

                  return (
                    <li
                      key={exercise.id}
                      className="group/ex flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-surface-container-high/50"
                    >
                      <div>
                        <p className="text-sm font-bold text-white transition-colors group-hover/ex:text-primary">
                          {exercise.name}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {completedSets.length} de {exercise.sets} Series completas
                        </p>
                      </div>
                      {bestSet && (
                        <div className="text-right">
                          <p className="text-sm font-black text-white">
                            {bestSet.load}kg × {bestSet.reps}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
                            Mejor Registro
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h5 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">
                <span className="h-[1px] w-4 bg-white" /> Complementarios
              </h5>
              <ul className="space-y-5">
                {exercises.slice(2).map((exercise) => {
                  const sets = getExerciseSessionSets(sessionData, exercise.id);
                  const completedSets = sets.filter((set) => set.completed);

                  return (
                    <li
                      key={exercise.id}
                      className="flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-surface-container-high/50"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{exercise.name}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {completedSets.length} Series finalizadas
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-md bg-surface-container px-2 py-1 text-[10px] font-black text-on-surface-variant">
                          {exercise.reps} REPS × {exercise.load}KG
                        </span>
                      </div>
                    </li>
                  );
                })}
                {exercises.length <= 2 && (
                  <p className="py-4 text-[10px] italic text-on-surface-variant">
                    Sin ejercicios complementarios en esta rutina.
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
