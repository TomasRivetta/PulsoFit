export default function LoginPage() {
  return (
    <>
      <main className="flex min-h-screen">
        {/* Left Side: Hero Image Section (Dynamic Visual) */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 z-0">
            <img
              alt="Hero Athlete"
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
              data-alt="Intense close-up of an elite athlete in a dark high-end gym, dramatic rim lighting, sweat beads, focused expression, cinematic moody atmosphere"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWg5b8ZK3hInqRRD2oKn3JSUS_72HN52l7Lci5_ghtSPT0OP7tKhOI1GDYoVtkiQDeqfuy83q72XZ-JSQUKUyyGh_dbqlU8Tvtkyc6nrmzQaO3Sl73IqXMLB2JrGoyuz0LxpNavZPa_7h4TsookXrhYUpKR1ptCwQBq8w9khYL55Mw2z81NqMtL_lrLVzex61bH9B1avJiusxjt_QE22_H-b9qAKS5ETANuhXKFSPdTHpy_4V1DVDGt13VxXlxbGuXSew02FQngg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full">
            <div>
              <span className="text-primary italic font-headline font-black tracking-tighter text-4xl">PULSO FIT</span>
            </div>
            <div className="max-w-xl">
              <h1 className="font-headline font-extrabold text-7xl text-white tracking-tight leading-[0.9] mb-8">
                PRECISIÓN <br /> RENDIMIENTO.
              </h1>
              <div className="flex items-center gap-6">
                <div className="h-[2px] w-24 bg-primary"></div>
                <p className="text-on-surface-variant text-lg font-medium tracking-wide uppercase">Laboratorio de Rendimiento Élite</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Right Side: Login/Registration Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface z-10 relative">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-12 text-center">
              <span className="text-primary italic font-headline font-black tracking-tighter text-3xl">PULSO FIT</span>
            </div>
            
            <header className="mb-10">
              <h2 className="text-white font-headline font-bold text-4xl tracking-tight mb-3">Bienvenido</h2>
              <p className="text-on-surface-variant">Ingrese sus credenciales de laboratorio para acceder a sus datos de rendimiento.</p>
            </header>
            
            {/* Login Form */}
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-1" htmlFor="email">Email</label>
                <div className="relative group">
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" id="email" placeholder="athlete@kinetic.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Contraseña</label>
                  <a className="text-xs font-medium text-primary hover:text-white transition-colors" href="#">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative group">
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-dim/20 transition-all outline-none" id="password" placeholder="••••••••••••" type="password" />
                </div>
              </div>
              <button className="kinetic-gradient w-full py-4 rounded-xl text-on-primary-fixed font-headline font-bold text-lg active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2 mt-4" type="submit">
                Acceder al Laboratorio
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>
            
            {/* Footer Link */}
            <p className="mt-12 text-center text-on-surface-variant text-sm font-medium">
              ¿Nuevo en el laboratorio? 
              <a className="text-primary font-bold hover:underline underline-offset-4 ml-1" href="/register">Crear Cuenta</a>
            </p>
          </div>
        </section>
      </main>

      {/* Background Decoration */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </>
  );
}
