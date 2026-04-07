import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)

  const todayString = new Date().toLocaleString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');

  // Fetch "routine of the day" by finding the first routine that has today's day included in scheduled_days
  const { data: featuredRoutineData } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', user.id)
    .contains('scheduled_days', [todayString])
    .limit(1)
    .maybeSingle();

  const featuredRoutine: any = featuredRoutineData;

  const defaultStats = {
    daily_streak: 0,
    energy_expenditure_kcal: 0,
    active_heart_rate_bpm: 0,
    weekly_output_volume_kg: {
      LUN: 0, MAR: 0, MIE: 0, JUE: 0, VIE: 0, SAB: 0, DOM: 0
    }
  }

  const currentStats = {
    daily_streak: stats?.daily_streak ?? defaultStats.daily_streak,
    energy_expenditure_kcal: stats?.energy_expenditure_kcal ?? defaultStats.energy_expenditure_kcal,
    active_heart_rate_bpm: stats?.active_heart_rate_bpm ?? defaultStats.active_heart_rate_bpm,
    weekly_output_volume_kg: stats?.weekly_output_volume_kg ?? defaultStats.weekly_output_volume_kg
  };
  const weeklyData = (currentStats.weekly_output_volume_kg as Record<string, number>) || defaultStats.weekly_output_volume_kg;

  const chartCols = [
    { day: 'LUN', h: `${weeklyData['LUN'] || 10}%`, active: false },
    { day: 'MAR', h: `${weeklyData['MAR'] || 10}%`, active: false },
    { day: 'MIE', h: `${weeklyData['MIE'] || 10}%`, active: true },
    { day: 'JUE', h: `${weeklyData['JUE'] || 10}%`, active: false },
    { day: 'VIE', h: `${weeklyData['VIE'] || 10}%`, active: false },
    { day: 'SAB', h: `${weeklyData['SAB'] || 10}%`, active: false },
    { day: 'DOM', h: `${weeklyData['DOM'] || 10}%`, active: false },
  ];

  const hasGoals = goals && goals.length > 0;

  return (
    <>
      {/* Hero Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter italic text-on-surface">
            CENTRO DE <span className="text-primary-dim">MANDO.</span>
          </h1>
          <p className="text-on-surface-variant text-lg mt-4 max-w-md font-body">
            Bienvenido de nuevo, Atleta. Tus métricas están optimizadas para la sesión de alta intensidad de hoy.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.2em]">Racha Diaria</p>
            <p className="text-4xl font-headline font-black text-primary italic">{currentStats.daily_streak} DÍAS</p>
          </div>
        </div>
      </header>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Primary Action: Routine of the Day */}
        <section className="md:col-span-8 group relative overflow-hidden rounded-[2rem] bg-surface-container-high h-[400px]">
          <div className="absolute inset-0 z-0">
            <img
              alt="Atleta preparándose para sesión de levantamiento pesado"
              className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEvlUTalL53GxMOWy-So1a3ussRP1OVPvCEFNtJzDkG8KHH_D5-gkWElAg0nklzsc7xIKn0Y7nk7DVn05tJCDHCKuVE7z7MtueYi2sUYmHFAe3RQnP_DmOTQRLa2WJ38IrwBeZQ0USiaHPXJU5g-TGZvNYuIX5zE0DvhfLCclKmQHoLqqiYRRAw6zY5kOapa-wG2m6L0jPvsMSaOyKKaoKmDbGfxQgyF23qvKHdEiYTPHLtqMF5ypRDdU9qC8-R7FVdC8_2nwRvA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest via-surface-container-highest/40 to-transparent"></div>
          </div>
          <div className="relative z-10 h-full p-10 flex flex-col justify-end">
            <span className="bg-primary-container text-on-primary-fixed text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
              Rutina del Día
            </span>
            <h2 className="text-3xl md:text-5xl font-headline font-black italic text-on-surface tracking-tighter mb-2 uppercase">
              {featuredRoutine?.title || 'No hay rutinas asignadas a este día'}
            </h2>
            {featuredRoutine && (
              <div className="flex items-center gap-6 text-on-surface-variant font-medium text-sm">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">timer</span> {featuredRoutine.duration_mins} MIN
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">bolt</span> {featuredRoutine.difficulty?.toUpperCase()}
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">fitness_center</span> {featuredRoutine.goal?.toUpperCase()}
                </span>
              </div>
            )}
            {featuredRoutine ? (
              <Link href={`/dashboard/routines/${featuredRoutine.id}/session`} className="mt-8 flex items-center justify-center bg-on-surface text-surface px-8 py-4 rounded-xl font-bold font-headline uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-fixed transition-colors active:scale-95 w-fit">
                Iniciar Sesión
              </Link>
            ) : (
              <Link href="/dashboard/routines/new" className="mt-8 flex items-center justify-center bg-on-surface text-surface px-8 py-4 rounded-xl font-bold font-headline uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-fixed transition-colors active:scale-95 w-fit">
                Crear Protocolo
              </Link>
            )}
          </div>
        </section>

        {/* Quick Stats Stack */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="glass-card flex-1 rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/10">
            <div>
              <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">Gasto de Energía</p>
              <h3 className="text-4xl font-headline font-black text-on-surface italic">
                {currentStats.energy_expenditure_kcal.toLocaleString()} <span className="text-lg font-normal not-italic text-on-surface-variant">KCAL</span>
              </h3>
            </div>
            <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-primary-dim shadow-[0_0_10px_rgba(190,238,0,0.5)]" 
                style={{ width: `${Math.min((currentStats.energy_expenditure_kcal / 3000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="glass-card flex-1 rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/10">
            <div>
              <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">Frecuencia Cardíaca Activa</p>
              <h3 className="text-4xl font-headline font-black text-secondary italic">
                {currentStats.active_heart_rate_bpm} <span className="text-lg font-normal not-italic text-on-surface-variant">BPM</span>
              </h3>
            </div>
            <div className="flex items-end gap-1 h-12 mt-4">
              <div className="w-2 bg-secondary/20 h-1/2 rounded-full"></div>
              <div className="w-2 bg-secondary/40 h-3/4 rounded-full"></div>
              <div className="w-2 bg-secondary/60 h-2/3 rounded-full"></div>
              <div className="w-2 bg-secondary/80 h-full rounded-full"></div>
              <div className="w-2 bg-secondary h-4/5 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart Card */}
        <section className="md:col-span-7 bg-surface-container rounded-[2rem] p-10 border border-outline-variant/10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-2xl font-headline font-black italic text-on-surface">RENDIMIENTO SEMANAL</h3>
              <p className="text-on-surface-variant text-sm">Rendimiento de volumen (Kgs movidos)</p>
            </div>
            <select className="bg-surface-container-high border-none text-on-surface text-xs font-bold rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary/30 outline-none">
              <option>Últimos 7 Días</option>
              <option>Último Mes</option>
            </select>
          </div>
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {chartCols.map((col, i) => (
              <div key={i} className="flex flex-col items-center gap-4 flex-1">
                <div
                  className={`w-full rounded-t-xl transition-all ${
                    col.active
                      ? 'bg-primary-container shadow-[0_0_20px_rgba(202,253,0,0.3)]'
                      : 'bg-surface-container-high hover:bg-primary-container/20'
                  }`}
                  style={{ height: col.h }}
                ></div>
                <span
                  className={`text-[10px] font-bold font-label ${
                    col.active ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Active Goals Section */}
        <section className="md:col-span-5 bg-surface-container-high rounded-[2rem] p-10 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            <h3 className="text-2xl font-headline font-black italic text-on-surface">OBJETIVOS</h3>
          </div>
          
          <div className="space-y-6">
            {!hasGoals ? (
              <p className="text-sm text-on-surface-variant">No se encontraron objetivos activos. Configura tus metas para medir el progreso aquí.</p>
            ) : (
              goals.map((goal) => (
                <div className="group" key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-on-surface">{goal.title}</span>
                    <span className={`text-xs font-label text-${goal.color_theme || 'primary'}`}>{goal.progress_percentage}%</span>
                  </div>
                  <div className="h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${goal.color_theme || 'primary-container'} w-[${goal.progress_percentage}%]`}
                      style={{ width: `${goal.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="mt-10 w-full py-4 rounded-xl bg-surface-bright text-on-surface font-bold text-sm uppercase tracking-widest border border-outline-variant/15 hover:bg-surface-container-highest transition-all">
            Administrar Metas
          </button>
        </section>
      </div>
    </>
  );
}
