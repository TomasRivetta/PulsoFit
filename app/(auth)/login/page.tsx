'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <>
      <main className="flex min-h-screen bg-surface selection:bg-primary/20 selection:text-primary overflow-hidden">
        {/* Left Side: Kinetic Tech Visual (Abstract CSS) */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] border-r border-outline-variant/10 items-center justify-center overflow-hidden">
          {/* Digital Aura Background Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
          
          {/* Pulse Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
            <span className="font-headline font-black text-[25vw] italic skew-x-[-12deg] tracking-tighter">PULSO</span>
          </div>

          <div className="relative z-10 flex flex-col justify-between p-20 h-full w-full">
            <header>
              <div className="flex items-center gap-3 group cursor-default">
                <span className="text-primary italic font-headline font-black tracking-tighter text-4xl group-hover:drop-shadow-[0_0_15px_rgba(202,253,0,0.4)] transition-all">PULSO FIT</span>
                <span className="h-[2px] w-12 bg-outline-variant/30 group-hover:w-20 transition-all duration-500"></span>
              </div>
            </header>

            <div className="max-w-xl">
              {/* Glassmorphic Display Card */}
              <div className="backdrop-blur-md bg-white/[0.01] border border-white/[0.05] p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                 
                 <h1 className="font-headline font-black text-7xl text-white tracking-tight leading-[0.85] italic mb-10 translate-x-[-4px]">
                  PRECISIÓN <br /> 
                  <span className="text-primary">RENDIMIENTO.</span>
                </h1>
                
                <div className="flex items-center gap-6">
                  <div className="h-[2px] w-16 bg-primary shadow-[0_0_10px_rgba(202,253,0,0.8)]"></div>
                  <p className="text-on-surface-variant text-sm font-bold tracking-[0.3em] uppercase opacity-70">
                    Protocolo de Élite Nivel 1.0
                  </p>
                </div>
                
                <div className="mt-12 flex gap-4 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                </div>
              </div>
            </div>

            <footer className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-secondary"></span> 
                Status: Operational
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary"></span> 
                Auth Mode: Secure
              </span>
            </footer>
          </div>
          
          {/* Decorative Mesh Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </section>
        
        {/* Right Side: Access Portal Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden">
          {/* Subtle secondary aura for form side */}
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-primary/3 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <div className="w-full max-w-md relative z-10">
            {/* Mobile Header Appearance */}
            <div className="lg:hidden mb-16 text-center">
              <span className="text-primary italic font-headline font-black tracking-tighter text-4xl mb-2 block">PULSO FIT</span>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-6 bg-primary/30"></div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-on-surface-variant">Protocolo Élite</span>
                <div className="h-[1px] w-6 bg-primary/30"></div>
              </div>
            </div>
            
            <header className="mb-12">
              <div className="inline-block bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md mb-4 border border-primary/20">
                Acceso_Autorizado
              </div>
              <h2 className="text-white font-headline font-black text-5xl tracking-tighter italic mb-4">BIENVENIDO.</h2>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-70">
                Sincroniza tus parámetros de entrenamiento y accede a la base de datos de rendimiento.
              </p>
            </header>
            
            {/* Login Form */}
            <form action={formAction} className="space-y-8">
              {state?.error && (
                <div className="bg-error/10 border-l-4 border-error text-error px-5 py-4 rounded-xl text-sm font-bold animate-[shake_0.5s_ease-in-out]">
                  {state.error.toUpperCase()}
                </div>
              )}
              
              <div className="space-y-3 group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-1 group-focus-within:text-primary transition-colors" htmlFor="email">
                  Identificador de Atleta
                </label>
                <div className="relative">
                  <input 
                    name="email" 
                    required 
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-5 px-6 text-on-surface focus:border-primary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" 
                    id="email" 
                    placeholder="E-MAIL DE LABORATORIO" 
                    type="email" 
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/10 group-focus-within:text-primary/40 transition-colors">alternate_email</span>
                </div>
              </div>

              <div className="space-y-3 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 group-focus-within:text-primary transition-colors" htmlFor="password">
                    Código de Acceso
                  </label>
                  <a className="text-[9px] font-black text-primary/50 hover:text-primary transition-colors uppercase tracking-widest" href="#">¿Recordar Clave?</a>
                </div>
                <div className="relative">
                  <input 
                    name="password" 
                    required 
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-5 px-6 text-on-surface focus:border-primary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" 
                    id="password" 
                    placeholder="••••••••••••" 
                    type="password" 
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/10 group-focus-within:text-primary/40 transition-colors">lock</span>
                </div>
              </div>

              <button 
                disabled={pending} 
                className="group relative w-full h-16 bg-primary text-on-primary-fixed font-headline font-black text-lg uppercase italic active:scale-[0.98] transition-all duration-300 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(202,253,0,0.2)] hover:shadow-[0_0_40px_rgba(202,253,0,0.4)]"
                type="submit"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none skew-x-[-20deg]"></div>
                <div className="flex items-center justify-center gap-3 relative z-10">
                  {pending ? 'Autorizando Protocolo...' : 'Iniciar Sincronización'}
                  {!pending && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">bolt</span>}
                </div>
              </button>
            </form>
            
            {/* Footer Navigation Link */}
            <p className="mt-16 text-center text-on-surface-variant text-xs font-black uppercase tracking-[0.2em]">
              ¿Sin Licencia? 
              <a className="text-secondary font-black hover:text-white transition-colors ml-2 border-b border-secondary/20 hover:border-secondary" href="/register">Inscribirse</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
