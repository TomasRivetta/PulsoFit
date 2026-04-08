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
        <section className="md:col-span-12 group relative overflow-hidden rounded-[2rem] bg-surface-container-high h-[400px]">
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

        {/* Placeholder or Future Sections can be added below */}
      </div>
    </>
  );
}
