import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch basic stats to show in profile
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Atleta'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter italic text-on-surface uppercase decoration-primary decoration-4">
          Perfil de <span className="text-primary-dim">Atleta.</span>
        </h1>
        <p className="text-on-surface-variant text-lg mt-4 font-body opacity-80">
          Gestión de identidad y parámetros de rendimiento.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Identity Card */}
        <div className="md:col-span-8">
          <section className="bg-surface-container rounded-[2.5rem] p-10 border border-outline-variant/10 relative overflow-hidden group min-h-[300px] flex items-center">
            {/* Ambient Background Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors"></div>
            
            <ProfileClient 
              user={user} 
              displayName={displayName} 
              avatarUrl={avatarUrl} 
            />
          </section>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <section className="bg-surface-container-high rounded-[2rem] p-8 border border-outline-variant/10">
            <h3 className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/60 mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">analytics</span>
              RENDIMIENTO_CORE
            </h3>
            
            <div className="space-y-8">
              <div>
                <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-bold mb-2">Racha Actual</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-headline font-black text-primary italic lowercase leading-none">{stats?.daily_streak || 0}</p>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">días</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 group hover:bg-primary/10 transition-colors">
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-3">Soporte Técnico</p>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">¿Necesitas ayuda con tu cuenta o el protocolo de entrenamiento?</p>
            <button className="w-full py-3 rounded-xl bg-surface-container-highest text-on-surface font-bold text-[10px] uppercase tracking-widest border border-outline-variant/10 hover:border-primary/50 transition-all">
              Contactar Soporte
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
