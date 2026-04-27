interface TimeMetrics {
  currVol: number;
  volChange: number;
  avgDuration: number;
  durTrend: number;
  strengthIndex: string;
}

interface FrequencyData {
  weeks: number[];
  avg: number;
}

interface MuscleDistribution {
  Legs: number;
  Back: number;
  Chest: number;
  Core: number;
  dominant: string;
  focus: string;
}

interface EvolutionChart {
  name: string;
  path: string;
  currentMax: number;
}

interface Milestone {
  name: string;
  weight: number;
  reps: number;
  date: string;
}

interface StatsHeaderProps {
  weeklyVolume: number;
  userStatus: string;
}

export function StatsHeader({ weeklyVolume, userStatus }: StatsHeaderProps) {
  return (
    <header className="mb-12 flex flex-col justify-between gap-6 px-4 md:flex-row md:items-end md:px-0">
      <div>
        <h1 className="mb-2 text-5xl font-headline font-black uppercase tracking-tighter italic text-white md:text-7xl">
          ANÁLISIS DE
          <br />
          <span className="text-primary">RENDIMIENTO</span>
        </h1>
        <p className="max-w-md font-medium text-on-surface-variant">
          Explora tu evolución fisiológica y potencia mecánica de los últimos 90 días.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="rounded-2xl border border-outline-variant/10 bg-surface-container px-6 py-4 shadow-xl">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Volumen Semanal
          </div>
          <div className="text-3xl font-headline font-black text-white">
            {weeklyVolume.toLocaleString()}{' '}
            <span className="text-xs font-normal not-italic text-on-surface-variant">kg</span>
          </div>
        </div>
        <div className="rounded-2xl border-l-4 border-secondary bg-surface-container-high px-6 py-4 shadow-xl">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
            Status de Usuario
          </div>
          <div className="text-3xl font-headline font-black text-white">{userStatus}</div>
        </div>
      </div>
    </header>
  );
}

interface EvolutionChartCardProps {
  charts: EvolutionChart[];
}

export function EvolutionChartCard({ charts }: EvolutionChartCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-outline-variant/5 bg-surface-container p-8 shadow-2xl md:col-span-8 md:p-10">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-headline font-black uppercase tracking-tighter italic text-white">
            Evolución de Carga
          </h3>
          <p className="text-sm font-medium text-on-surface-variant">
            Levantamientos principales (Ventana de 3 meses)
          </p>
        </div>
        <div className="flex gap-2">
          {charts.map((chart, index) => (
            <span
              key={chart.name}
              className="flex items-center gap-2 rounded-full border border-outline-variant/10 bg-surface-container-high px-4 py-2 text-[10px] font-black uppercase leading-none tracking-widest text-white"
            >
              <span
                className={`h-2 w-2 rounded-full shadow-lg ${
                  index === 0 ? 'bg-primary shadow-primary/30' : 'bg-secondary shadow-secondary/30'
                }`}
              />
              {chart.name}
            </span>
          ))}
          {charts.length === 0 && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
              Sin datos de carga
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-8 h-64">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          <div className="w-full border-t border-outline-variant/5" />
          <div className="w-full border-t border-outline-variant/5" />
          <div className="w-full border-t border-outline-variant/5" />
          <div className="w-full border-t border-outline-variant/5" />
        </div>
        <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <defs>
            <linearGradient id="chartGrad" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(202,253,0,0.2)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(202,253,0,0)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {charts.map((chart, index) => (
            <g key={chart.name}>
              <path
                className={index === 1 ? 'opacity-60' : ''}
                d={chart.path}
                fill="none"
                stroke={index === 0 ? '#cafd00' : '#679cff'}
                strokeDasharray={index === 1 ? '8 4' : '0'}
                strokeLinecap="round"
                strokeWidth="4"
              />
              {index === 0 && chart.path && <path d={`${chart.path} L1000,200 L0,200 Z`} fill="url(#chartGrad)" />}
            </g>
          ))}

          {charts.length === 0 && (
            <text
              x="500"
              y="100"
              textAnchor="middle"
              className="fill-on-surface-variant/20 text-2xl font-black uppercase tracking-tighter italic"
            >
              DATOS INSUFICIENTES.EXE
            </text>
          )}
        </svg>
        <div className="mt-6 flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">
          <span>OCT</span>
          <span>NOV</span>
          <span>DIC</span>
          <span>ENE</span>
        </div>
      </div>
    </div>
  );
}

interface FrequencyCardProps {
  frequencyData: FrequencyData;
}

export function FrequencyCard({ frequencyData }: FrequencyCardProps) {
  return (
    <div className="flex flex-col rounded-[2.5rem] border border-outline-variant/5 bg-surface-container p-8 shadow-2xl md:col-span-4 md:p-10">
      <h3 className="mb-8 text-2xl font-headline font-black uppercase tracking-tighter italic text-white">
        Frecuencia
      </h3>
      <div className="flex flex-1 items-end justify-between gap-3 px-2">
        {frequencyData.weeks.map((count, index) => (
          <div
            key={`${index}-${count}`}
            className={`group relative flex-1 rounded-t-xl transition-all duration-500 ${
              index === 4
                ? 'bg-primary shadow-[0_0_30px_rgba(202,253,0,0.3)]'
                : 'bg-surface-container-high hover:bg-primary/20'
            }`}
            style={{ height: `${Math.max(15, (count / 7) * 100)}%` }}
          >
            <div
              className={`absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-lg bg-primary px-3 py-1 text-[10px] font-black italic text-on-primary-fixed opacity-0 shadow-xl transition-opacity group-hover:opacity-100 ${
                index === 4 ? 'opacity-100 !-translate-y-1' : ''
              }`}
            >
              {index === 4 ? 'ELITE' : `${count}d`}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-outline-variant/10 pt-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
          Promedio sesiones/sem
        </span>
        <span className="text-3xl font-headline font-black italic text-white">{frequencyData.avg.toFixed(1)}</span>
      </div>
    </div>
  );
}

interface MuscleDistributionCardProps {
  muscleDistribution: MuscleDistribution;
}

export function MuscleDistributionCard({ muscleDistribution }: MuscleDistributionCardProps) {
  const dominantLabel =
    muscleDistribution.dominant === 'Legs'
      ? 'Tren Inferior'
      : muscleDistribution.dominant === 'Back'
        ? 'Cadena Posterior'
        : muscleDistribution.dominant === 'Chest'
          ? 'Cadena Anterior'
          : 'Core Stability';

  return (
    <div className="flex flex-col gap-10 rounded-[2.5rem] border border-outline-variant/10 bg-surface-container-high p-8 shadow-2xl md:col-span-5 md:p-10">
      <div>
        <h3 className="mb-2 text-2xl font-headline font-black uppercase tracking-tighter italic text-white">
          Distribución Muscular
        </h3>
        <p className="text-sm font-medium text-on-surface-variant">
          Volumen de trabajo relativo por categoría
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center scale-110">
        <div className="absolute flex h-44 w-44 items-center justify-center rounded-full border border-outline-variant/10">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-outline-variant/10">
            <div className="h-12 w-12 rounded-full border border-outline-variant/10" />
          </div>
        </div>
        <div className="absolute h-44 w-[1px] bg-outline-variant/20" />
        <div className="absolute h-[1px] w-44 bg-outline-variant/20" />

        <span className="absolute -top-6 text-[10px] font-black uppercase tracking-widest text-[#cafd00]">
          Piernas
        </span>
        <span className="absolute -bottom-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
          Espalda
        </span>
        <span className="absolute -left-10 -rotate-90 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
          Pecho
        </span>
        <span className="absolute -right-10 rotate-90 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
          Core
        </span>

        <svg className="absolute h-44 w-44" viewBox="0 0 100 100">
          <polygon
            className="drop-shadow-[0_0_10px_rgba(103,156,255,0.5)]"
            fill="rgba(103,156,255,0.4)"
            points={`50,${50 - muscleDistribution.Legs / 2} ${50 + muscleDistribution.Core / 2},50 50,${50 + muscleDistribution.Back / 2} ${50 - muscleDistribution.Chest / 2},50`}
            stroke="#679cff"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-outline-variant/5 bg-surface-container p-5">
          <div className="mb-2 text-[9px] font-black uppercase tracking-widest text-secondary">Dominante</div>
          <div className="text-lg font-headline font-black uppercase italic text-white">{dominantLabel}</div>
        </div>
        <div className="rounded-2xl border border-outline-variant/5 bg-surface-container p-5">
          <div className="mb-2 text-[9px] font-black uppercase tracking-widest text-primary-dim">Enfoque</div>
          <div className="text-lg font-headline font-black uppercase italic text-white">{muscleDistribution.focus}</div>
        </div>
      </div>
    </div>
  );
}

interface SecondaryMetricsSectionProps {
  milestones: Milestone[];
  timeMetrics: TimeMetrics;
}

export function SecondaryMetricsSection({ milestones, timeMetrics }: SecondaryMetricsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:col-span-7 md:grid-cols-2">
      <div className="group relative overflow-hidden rounded-[2.5rem] border border-outline-variant/5 bg-surface-container p-8 shadow-xl transition-all hover:ring-1 hover:ring-primary/20">
        <div className="mb-10 flex justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl">trending_up</span>
          </div>
          <div className="text-right">
            <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
              vs Mes Pasado
            </div>
            <div className={`${timeMetrics.volChange >= 0 ? 'text-primary' : 'text-red-400'} text-lg font-black italic`}>
              {timeMetrics.volChange >= 0 ? '+' : ''}
              {timeMetrics.volChange.toFixed(1)}%
            </div>
          </div>
        </div>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Índice de Fuerza</h4>
        <div className="text-5xl font-headline font-black italic text-white">
          {timeMetrics.strengthIndex}
          <span className="ml-2 text-base font-normal lowercase not-italic text-on-surface-variant">kN</span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-[2.5rem] border border-outline-variant/5 bg-surface-container p-8 shadow-xl transition-all hover:ring-1 hover:ring-secondary/20">
        <div className="mb-10 flex justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl">timer</span>
          </div>
          <div className="text-right">
            <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Tendencia</div>
            <div className={`${timeMetrics.durTrend <= 0 ? 'text-secondary' : 'text-primary'} text-lg font-black italic`}>
              {timeMetrics.durTrend <= 0 ? '' : '+'}
              {timeMetrics.durTrend.toFixed(0)}m avg
            </div>
          </div>
        </div>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Duración Med. Sesión
        </h4>
        <div className="text-5xl font-headline font-black italic text-white">
          {timeMetrics.avgDuration.toFixed(0)}
          <span className="ml-2 text-base font-normal lowercase not-italic text-on-surface-variant">min</span>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-outline-variant/5 bg-surface-container p-10 shadow-2xl md:col-span-2">
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-2xl font-headline font-black uppercase tracking-tighter italic text-white">
            Hitos Recientes
          </h3>
          <button className="rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            Ver Todos
          </button>
        </div>
        <div className="space-y-2">
          {milestones.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-on-surface-variant opacity-40">
              Entrena para registrar tus primeros hitos.
            </p>
          ) : (
            milestones.map((milestone) => (
              <div
                key={`${milestone.name}-${milestone.date}`}
                className="group flex items-center justify-between rounded-2xl border-b border-outline-variant/5 p-4 transition-colors last:border-0 hover:bg-surface-container-high/50"
              >
                <div className="flex items-center gap-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-surface-container-high text-on-surface-variant transition-colors group-hover:text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      military_tech
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight text-white">{milestone.name}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Nuevo récord personal
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black italic text-primary">{milestone.weight} kg</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">
                    {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(
                      new Date(milestone.date),
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
