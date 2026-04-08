'use client'

import { useActionState } from 'react'
import { signup } from '../actions'

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signup, null)

  return (
    <>
      <main className="flex min-h-screen bg-surface selection:bg-primary/20 selection:text-primary overflow-hidden">
        {/* Left Side: Kinetic Visual (Synced with Login) */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] border-r border-outline-variant/10 items-center justify-center overflow-hidden">
          {/* Digital Aura Background Elements */}
          <div className="absolute top-[-5%] left-[-10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[140px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          
          {/* Kinetic Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] select-none pointer-events-none">
            <span className="font-headline font-black text-[20vw] italic skew-x-[-15deg] tracking-tighter">KINETIC</span>
          </div>

          <div className="relative z-10 flex flex-col justify-between p-20 h-full w-full">
            <header>
              <div className="flex items-center gap-3 cursor-default group">
                <span className="text-primary italic font-headline font-black tracking-tighter text-4xl group-hover:drop-shadow-[0_0_15px_rgba(202,253,0,0.5)] transition-all">PULSO FIT</span>
                <span className="h-[2px] w-12 bg-outline-variant/30 group-hover:w-24 transition-all duration-700"></span>
              </div>
            </header>

            <div className="max-w-xl">
              {/* Glassmorphic Brand Card */}
              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.08] p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
                
                <span className="text-primary/70 font-headline font-black tracking-[0.4em] text-[10px] uppercase mb-6 block">Protocolo de Registro</span>
                
                <h1 className="font-headline font-black text-7xl text-white tracking-tight leading-[0.85] italic mb-8">
                  ELEVA <br /> 
                  <span className="text-secondary drop-shadow-[0_0_10px_rgba(103,156,255,0.3)]">TU NIVEL.</span>
                </h1>
                
                <div className="flex items-center gap-6">
                  <div className="h-[2px] w-16 bg-secondary"></div>
                  <p className="text-on-surface-variant text-sm font-bold tracking-[0.2em] uppercase opacity-60">
                    Ecosistema de Rendimiento
                  </p>
                </div>
              </div>
            </div>

            <footer className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30">Módulo</span>
                <span className="text-[11px] font-black text-white italic">Atleta_Onboarding_V2</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30">Encriptación</span>
                <span className="text-[11px] font-black text-primary italic">AES-256_ACTIVE</span>
              </div>
            </footer>
          </div>
          
          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
        </section>
        
        {/* Right Side: Deployment Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16 lg:p-24 relative overflow-hidden bg-surface">
          {/* Aura background for registration side */}
          <div className="absolute bottom-[10%] left-[10%] w-[35%] h-[35%] bg-secondary/3 rounded-full blur-[120px] pointer-events-none z-0"></div>
          
          <div className="w-full max-w-md relative z-10">
            {/* Mobile View Branding */}
            <div className="lg:hidden mb-16 text-center">
              <span className="text-primary italic font-headline font-black tracking-tighter text-5xl mb-3 block">PULSO FIT</span>
              <span className="text-[9px] font-black tracking-[0.5em] uppercase text-on-surface-variant opacity-60 border-y border-outline-variant/10 py-2 inline-block">Alta de Nuevo Atleta</span>
            </div>
            
            <header className="mb-12">
              <div className="inline-block bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md mb-4 border border-secondary/20">
                Data_Provisioning
              </div>
              <h2 className="text-white font-headline font-black text-4xl md:text-5xl tracking-tighter italic mb-4 uppercase">Crear Cuenta.</h2>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-70">
                Asigna tus identificadores y únete a la red global de entrenamiento inteligente.
              </p>
            </header>
            
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="bg-error/10 border-l-4 border-error text-error px-5 py-4 rounded-xl text-[10px] font-black tracking-widest animate-[shake_0.5s_ease-in-out]">
                  ERROR_LOG: {state.error.toUpperCase()}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 group">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-1">Nombre</label>
                  <input name="nombre" required className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 px-6 text-on-surface focus:border-secondary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" placeholder="PILA" type="text" />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-1">Apellido</label>
                  <input name="apellido" required className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 px-6 text-on-surface focus:border-secondary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" placeholder="CARGA" type="text" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-1" htmlFor="email">Correo Institucional</label>
                <div className="relative group">
                  <input name="email" required className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-5 px-6 text-on-surface focus:border-secondary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" id="email" placeholder="ATLETA@PULSO.LAB" type="email" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/10 group-focus-within:text-secondary/60 transition-colors">fingerprint</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-1">Clave</label>
                  <input name="password" required minLength={6} className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 px-6 text-on-surface focus:border-secondary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" placeholder="••••••••" type="password" />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-1">Validar</label>
                  <input name="confirm-password" required minLength={6} className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 px-6 text-on-surface focus:border-secondary/40 focus:bg-surface-container-highest transition-all outline-none font-bold placeholder:text-white/10" placeholder="••••••••" type="password" />
                </div>
              </div>

              <button 
                disabled={pending} 
                className="group relative w-full h-16 kinetic-gradient text-on-primary-fixed font-headline font-black text-lg uppercase italic active:scale-[0.98] transition-all duration-300 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(202,253,0,0.2)] hover:shadow-[0_15px_45px_rgba(202,253,0,0.3)] mt-6"
                type="submit"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none skew-x-[-20deg]"></div>
                <div className="flex items-center justify-center gap-3 relative z-10">
                  {pending ? 'Desplegando Credenciales...' : 'Desplegar Token Atleta'}
                  {!pending && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">rocket_launch</span>}
                </div>
              </button>
            </form>

            <footer className="mt-16 text-center space-y-12">
              <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em]">
                ¿Sesión Activa? 
                <a className="text-primary font-black hover:text-white transition-colors ml-2 decoration-primary/40 decoration-wavy underline" href="/login">Acceder</a>
              </p>
              
              <p className="text-[9px] text-outline uppercase tracking-[0.25em] leading-loose opacity-40 hover:opacity-100 transition-opacity max-w-[280px] mx-auto">
                Al inicializar registro, aceptas los 
                <a className="text-on-surface mx-1 hover:text-primary transition-colors" href="#">Términos_Globales</a> &amp; 
                <a className="text-on-surface mx-1 hover:text-primary transition-colors" href="#">Privacidad_Red</a>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
