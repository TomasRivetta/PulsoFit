import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
            <span className="text-primary-dim font-headline font-bold text-sm tracking-[0.2em] uppercase mb-2 block">Training Protocol</span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface">Routines</h1>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full md:w-80 bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary-dim/20 transition-all outline-none" placeholder="Search routines..." type="text"/>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center bg-surface-container-high rounded-full px-4 py-2 gap-2 border border-outline-variant/10 shrink-0">
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant">Frequency:</span>
            <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer p-0 pr-6 outline-none appearance-none">
              <option>All Days</option>
              <option>3 Days</option>
              <option>4 Days</option>
              <option>5+ Days</option>
            </select>
          </div>
          <div className="flex items-center bg-surface-container-high rounded-full px-4 py-2 gap-2 border border-outline-variant/10 shrink-0">
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant">Goal:</span>
            <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer p-0 pr-6 outline-none appearance-none">
              <option>Hypertrophy</option>
              <option>Strength</option>
              <option>Endurance</option>
              <option>Mobility</option>
            </select>
          </div>
          <button className="bg-surface-variant/40 hover:bg-surface-variant text-on-surface-variant hover:text-on-surface px-6 py-2 rounded-full text-sm font-bold font-headline transition-all shrink-0">
            Clear Filters
          </button>
        </div>
        
        {/* Routine Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {routines && routines.length > 0 ? routines.map((routine) => {
            return (
              <Link href={`/dashboard/routines/${routine.id}`} key={routine.id}>
                <div className={`h-full group relative overflow-hidden rounded-[2rem] bg-surface-container p-8 border border-outline-variant/5 hover:border-${routine.color_theme || 'primary'}-dim/20 transition-all flex flex-col`}>
                  <div className="mb-6 flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl bg-${routine.color_theme || 'primary'}-container/20 flex items-center justify-center text-${routine.color_theme || 'primary'}`}>
                      <span className="material-symbols-outlined text-3xl">bolt</span>
                    </div>
                    <span className="text-[#adaaaa] text-xs font-headline font-bold tracking-widest uppercase">{routine.goal}</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">{routine.title}</h3>
                  <p className="text-on-surface-variant text-sm mb-6 flex-1 leading-relaxed">{routine.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-${routine.color_theme || 'primary'} font-headline font-extrabold text-xl`}>{routine.frequency_days} <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Days</span></span>
                    <div className="flex gap-2">
                       <span className={`text-[10px] font-bold text-${routine.color_theme || 'primary'} px-2 py-0.5 bg-${routine.color_theme || 'primary'}/10 rounded uppercase`}>{routine.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <p className="text-on-surface-variant">No routines found.</p>
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
          Create New Routine
        </span>
      </Link>
    </>
  );
}
