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

  const daysMap = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const todayString = daysMap[new Date().getDay()];

  // Fetch "routine of the day" by finding the first routine that has today's day included in scheduled_days
  const { data: featuredRoutineData } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', user.id)
    .contains('scheduled_days', [todayString])
    .limit(1)
    .maybeSingle();

  const featuredRoutine: any = featuredRoutineData;

  const currentStats = {
    daily_streak: stats?.daily_streak ?? 0,
  };

  return (
    <>
      {/* Hero Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter italic text-on-surface">
            CENTRO DE <span className="text-primary-dim">MANDO.</span>
          </h1>
          <p className="text-on-surface-variant text-lg mt-4 max-w-md font-body">
            Bienvenido de nuevo, Atleta.
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
        {/* Primary Action: Routine of the Day */}
        <section className="md:col-span-12 group relative overflow-hidden rounded-[2rem] h-[400px] hero-lab-gradient border border-outline-variant/30 flex flex-col justify-end p-10 hover:border-primary-dim/30 transition-colors duration-500">
          <div className="scanline"></div>
          
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-md mb-6 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {featuredRoutine ? 'Misión Activa' : 'Sistema en Espera'}
                </span>
                
                <h2 className="text-4xl md:text-6xl font-headline font-black italic text-on-surface tracking-tighter mb-4 uppercase leading-none text-shadow-glow">
                  {featuredRoutine?.title || (
                    <span className="text-on-surface-variant/50">
                      SIN <span className="text-on-surface">PROTOCOLOS</span> ASIGNADOS
                    </span>
                  )}
                </h2>

                {featuredRoutine ? (
                  <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-medium text-sm">
                    <span className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-lg">timer</span> {featuredRoutine.duration_mins} MIN
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-lg">bolt</span> {featuredRoutine.difficulty?.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-lg">fitness_center</span> {featuredRoutine.goal?.toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <p className="text-on-surface-variant max-w-sm text-lg font-body leading-relaxed">
                    Tu plan de entrenamiento está listo para ser desplegado. Selecciona una rutina para comenzar tu evolución.
                  </p>
                )}
              </div>

              <div className="flex flex-shrink-0">
                {featuredRoutine ? (
                  <Link href={`/dashboard/routines/${featuredRoutine.id}/session`} className="group/btn relative overflow-hidden bg-primary-container text-on-primary-fixed px-10 py-5 rounded-2xl font-black font-headline uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(202,253,0,0.2)]">
                    <span className="relative z-10 flex items-center gap-3">
                      Iniciar Sesión <span className="material-symbols-outlined translate-y-[1px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                  </Link>
                ) : (
                  <Link href="/dashboard/routines/new" className="group/btn relative overflow-hidden bg-on-surface text-surface px-10 py-5 rounded-2xl font-black font-headline uppercase tracking-[0.2em] transition-all hover:bg-primary-container hover:text-on-primary-fixed hover:scale-105 active:scale-95">
                    <span className="relative z-10 flex items-center gap-3">
                      Crear Protocolo <span className="material-symbols-outlined translate-y-[1px]">add</span>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary/10 rounded-tr-[2rem] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary/10 rounded-bl-[2rem] pointer-events-none"></div>
        </section>

        {/* Placeholder or Future Sections can be added below */}
      </div>
    </>
  );
}
