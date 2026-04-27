import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getRoutineTheme, type RoutineRecord } from '@/lib/domain/routines'

export default async function RoutinesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all routines accessible to user (global ones + own ones due to RLS)
  const { data: routines } = await supabase.from('routines').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary-dim font-headline font-bold text-sm tracking-[0.2em] uppercase mb-2 block">Protocolo de Entrenamiento</span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface">Rutinas</h1>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110">search</span>
              <input 
                className="w-full md:w-80 glass-card bg-surface-container/40 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all outline-none shadow-lg group-hover:bg-surface-container/60" 
                placeholder="Buscar rutinas..." 
                type="text"
              />
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-xl -z-10" />
            </div>
          </div>
        </div>
        
        <div className="relative mb-10 overflow-hidden">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 pr-10 -mx-1 px-1">
            <div className="group flex items-center glass-card bg-surface-container/50 hover:bg-surface-container-high transition-all rounded-2xl pl-4 pr-2 py-3 gap-2 border border-outline-variant/20 hover:border-primary/30 shrink-0 cursor-pointer active:scale-95">
              <span className="text-[10px] font-bold font-headline uppercase tracking-[0.15em] text-on-surface-variant/80">Frecuencia</span>
              <div className="relative flex items-center">
                <select className="bg-transparent border-none text-sm font-extrabold text-primary focus:ring-0 cursor-pointer py-0 pl-1 pr-6 outline-none appearance-none z-10 hover:text-primary-dim transition-colors">
                  <option className="bg-surface-container-highest text-on-surface">Todos</option>
                  <option className="bg-surface-container-highest text-on-surface">3 Días</option>
                  <option className="bg-surface-container-highest text-on-surface">4 Días</option>
                  <option className="bg-surface-container-highest text-on-surface">5+ Días</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 text-primary/70 text-lg pointer-events-none transition-transform group-hover:translate-y-[1px]">expand_more</span>
              </div>
            </div>

            <div className="group flex items-center glass-card bg-surface-container/50 hover:bg-surface-container-high transition-all rounded-2xl pl-4 pr-2 py-3 gap-2 border border-outline-variant/20 hover:border-primary/30 shrink-0 cursor-pointer active:scale-95">
              <span className="text-[10px] font-bold font-headline uppercase tracking-[0.15em] text-on-surface-variant/80">Objetivo</span>
              <div className="relative flex items-center">
                <select className="bg-transparent border-none text-sm font-extrabold text-primary focus:ring-0 cursor-pointer py-0 pl-1 pr-6 outline-none appearance-none z-10 hover:text-primary-dim transition-colors">
                  <option className="bg-surface-container-highest text-on-surface">Hipertrofia</option>
                  <option className="bg-surface-container-highest text-on-surface">Fuerza</option>
                  <option className="bg-surface-container-highest text-on-surface">Resistencia</option>
                  <option className="bg-surface-container-highest text-on-surface">Movilidad</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 text-primary/70 text-lg pointer-events-none transition-transform group-hover:translate-y-[1px]">expand_more</span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-variant/20 hover:bg-surface-variant/40 text-on-surface-variant hover:text-on-surface text-[10px] font-bold font-headline uppercase tracking-widest transition-all shrink-0 active:scale-95 border border-transparent hover:border-outline-variant/20">
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              Limpiar
            </button>
          </div>
          {/* Gradient fade to indicate scroll */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none z-10 hidden sm:block" />
        </div>
        
        {/* Routine Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {routines && routines.length > 0 ? routines.map((routine) => {
            const typedRoutine = routine as RoutineRecord
            const theme = getRoutineTheme(typedRoutine.color_theme)
            return (
              <Link href={`/dashboard/routines/${typedRoutine.id}`} key={typedRoutine.id}>
                <div className={`h-full group relative overflow-hidden rounded-[2rem] bg-surface-container p-8 border border-outline-variant/5 transition-all flex flex-col ${theme.borderHover}`}>
                  <div className="mb-6 flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.icon}`}>
                      <span className="material-symbols-outlined text-3xl">bolt</span>
                    </div>
                    <span className="text-[#adaaaa] text-xs font-headline font-bold tracking-widest uppercase">{typedRoutine.goal}</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">{typedRoutine.title}</h3>
                  <p className="text-on-surface-variant text-sm mb-6 flex-1 leading-relaxed">{typedRoutine.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`font-headline font-extrabold text-xl ${theme.metric}`}>{typedRoutine.frequency_days} <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Días</span></span>
                    <div className="flex gap-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${theme.pill}`}>{typedRoutine.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <p className="text-on-surface-variant">No se encontraron rutinas.</p>
          )}
        </div>
      </div>

      {/* Create New Routine FAB */}
      <Link 
        href="/dashboard/routines/new"
        className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 w-16 h-16 bg-primary-container text-on-primary-fixed rounded-2xl shadow-2xl shadow-primary-container/20 flex items-center justify-center active:scale-90 transition-transform z-50 group hover:opacity-90"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
        <span className="absolute right-full mr-4 bg-surface-container-high text-white text-xs font-bold font-headline py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Crear Nueva Rutina
        </span>
      </Link>
    </>
  );
}
