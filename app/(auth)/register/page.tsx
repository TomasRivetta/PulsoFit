export default function RegisterPage() {
  return (
    <>
      {/* Decorative Kinetic Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary-container/20 overflow-hidden pointer-events-none z-50">
        <div className="h-full w-1/3 kinetic-gradient animate-pulse"></div>
      </div>

      <main className="w-full min-h-screen flex flex-col md:flex-row">
        {/* Left Side: Visual/Inspiration */}
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-surface">
          <div className="absolute inset-0 z-0">
            <img
              alt="High performance fitness"
              className="w-full h-full object-cover opacity-60 scale-110 grayscale hover:grayscale-0 transition-all duration-1000"
              data-alt="Intense close-up of a professional athlete in a dark, moody gym, dramatic cinematic lighting with electric lime highlights, smoke and grit texture"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUkjFdZhA0NKV4T3JzIT-tuYWiRGUPeev43_rMMy0BkWVUj4PGA2xyGchC6meLpmYR34GSUOa8Kp2G55oZ60n2QNYno-ItevqUeYVet1aruBMDxPHYX_uDNAe3J15J-70_mVdLkYXr9-JwANWCeAiQ5fdcd6TBcicuwuk6_vHa5OR9lPbUUGS8JSjFlk6fPx5IEu8b9UEZkLWfFJTs1eS-hb1YArIqw9qk20U9A_28KSFPxmnn70IYi8pNOllbFg_th56DwUimmw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-end p-16 w-full h-full">
            <div className="mb-8">
              <span className="text-primary-container font-headline font-extrabold tracking-[0.2em] text-sm uppercase">Laboratory Mode</span>
              <h1 className="text-6xl lg:text-8xl font-headline font-black italic tracking-tighter leading-none mt-4">
                LEVEL UP<br />YOUR <span className="text-primary-container">ENGINE</span>
              </h1>
            </div>
            <p className="text-on-surface-variant font-body max-w-md text-lg leading-relaxed">
              Join the elite performance ecosystem. Precision tracking, scientific insights, and unstoppable kinetic energy.
            </p>
          </div>
        </section>

        {/* Right Side: Registration Form */}
        <section className="w-full md:w-1/2 lg:w-2/5 min-h-screen flex flex-col justify-center items-center px-8 lg:px-16 py-12 bg-surface">
          {/* Top Branding (Mobile Friendly) */}
          <div className="w-full max-w-md flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-container flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-on-primary-fixed text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <span className="font-headline font-black italic tracking-tighter text-2xl text-primary-container">PULSO FIT</span>
            </div>
            <a className="text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">
              Help
            </a>
          </div>

          <div className="w-full max-w-md">
            <header className="mb-10">
              <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">Crear Cuenta</h2>
              <p className="text-on-surface-variant font-body">Ingresa tus datos para comenzar tu viaje.</p>
            </header>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Nombre</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" placeholder="John" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Apellido</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" placeholder="Doe" type="text" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Email</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 pl-12 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" placeholder="john@example.com" type="email" />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Contraseña</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 pl-12 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" placeholder="••••••••" type="password" />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Repetir contraseña</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 pl-12 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" placeholder="••••••••" type="password" />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">verified_user</span>
                </div>
              </div>

              <button className="w-full kinetic-gradient py-4 rounded-xl text-on-primary-fixed font-headline font-bold text-lg active:scale-95 transition-transform duration-200 mt-4 flex items-center justify-center gap-2 group" type="submit">
                Crear Cuenta
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-on-surface-variant font-body">
                ¿Ya tienes una cuenta? 
                <a className="text-primary-container font-bold hover:underline ml-1" href="/login">Inicia sesión</a>
              </p>
            </footer>

            {/* Legal/Terms */}
            <div className="mt-16 text-center">
              <p className="text-[10px] text-outline uppercase tracking-widest leading-relaxed">
                Al registrarte, aceptas nuestros <br />
                <a className="text-on-surface hover:text-primary transition-colors" href="#">Términos de Servicio</a> &amp; <a className="text-on-surface hover:text-primary transition-colors" href="#">Política de Privacidad</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
