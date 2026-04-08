'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/(auth)/actions';

export function Navigation() {
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';
  const isWorkouts = pathname?.startsWith('/dashboard/routines');
  const isHistory = pathname?.startsWith('/dashboard/history');
  const isStats = pathname?.startsWith('/dashboard/stats');
  const isProfile = pathname === '/dashboard/profile';

  const getSidebarItemClass = (active: boolean) => 
    active
      ? "bg-[#1a1a1a] text-[#ccff00] border-r-4 border-[#ccff00] px-6 py-4 flex items-center gap-4 transition-all"
      : "text-[#adaaaa] px-6 py-4 flex items-center gap-4 hover:bg-[#131313] hover:text-white transition-all";

  const getBottomNavItemClass = (active: boolean) =>
    active
      ? "flex flex-col items-center justify-center bg-[#cafd00] text-[#3a4a00] rounded-2xl px-5 py-2 active:scale-90 transition-transform"
      : "flex flex-col items-center justify-center text-[#adaaaa] px-5 py-2 hover:text-white active:scale-90 transition-transform";

  return (
    <>
      {/* SideNavBar (Desktop) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-[#0e0e0e] py-8 z-40">
        <div className="px-8 mt-4 mb-8">
          <div className="mt-8">
            <p className="text-on-surface font-bold text-lg font-headline">Rendimiento Élite</p>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-label">Modo Laboratorio</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className={getSidebarItemClass(isDashboard)}>
            <span className="material-symbols-outlined">grid_view</span>
            <span className="font-headline font-semibold">Panel</span>
          </Link>
          <Link href="/dashboard/routines" className={getSidebarItemClass(isWorkouts)}>
            <span className="material-symbols-outlined">fitness_center</span>
            <span className="font-headline font-semibold">Rutinas</span>
          </Link>
          <Link href="/dashboard/history" className={getSidebarItemClass(isHistory)}>
            <span className="material-symbols-outlined">history</span>
            <span className="font-headline font-semibold">Historial</span>
          </Link>
          <Link href="/dashboard/stats" className={getSidebarItemClass(isStats)}>
            <span className="material-symbols-outlined">insights</span>
            <span className="font-headline font-semibold">Estadísticas</span>
          </Link>
        </nav>
        
        <div className="px-6 mb-8">
          <Link href="/dashboard/routines/new" className="w-full bg-primary-container text-on-primary-fixed font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary-container/10">
            <span className="material-symbols-outlined">bolt</span>
            Iniciar Entrenamiento
          </Link>
        </div>

        <div className="border-t border-outline-variant/10 pt-4 space-y-1">
          <Link href="#" className="text-[#adaaaa] px-6 py-3 flex items-center gap-4 hover:bg-[#131313] hover:text-white transition-all text-sm">
            <span className="material-symbols-outlined">help</span>
            <span className="font-headline font-semibold">Soporte</span>
          </Link>
          <Link href="/dashboard/profile" className={getSidebarItemClass(isProfile) + " !shadow-none !border-r-0 !px-6 !py-3 text-sm"}>
            <span className="material-symbols-outlined">person</span>
            <span className="font-headline font-semibold">Perfil</span>
          </Link>
          {/* Logout Form using Next.js form action logic assuming handled in actions or via standard route */}
          <form action={logout} className="w-full">
            <button className="w-full text-[#adaaaa] px-6 py-3 flex items-center gap-4 hover:bg-[#131313] hover:text-white transition-all text-sm cursor-pointer border-none bg-transparent">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-headline font-semibold">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-[#0e0e0e]/90 backdrop-blur-2xl lg:hidden z-50 rounded-t-[2rem] border-t border-[#484847]/15 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Link href="/dashboard" className={getBottomNavItemClass(isDashboard)}>
          <span className="material-symbols-outlined">home</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Inicio</span>
        </Link>
        <Link href="/dashboard/routines" className={getBottomNavItemClass(isWorkouts)}>
          <span className="material-symbols-outlined">bolt</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Entrenar</span>
        </Link>
        <Link href="/dashboard/history" className={getBottomNavItemClass(isHistory)}>
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Historial</span>
        </Link>
        <Link href="/dashboard/profile" className={getBottomNavItemClass(isProfile)}>
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Perfil</span>
        </Link>
      </nav>
      
      {/* Floating Action Button (FAB) -> only show on Workouts on mobile? 
          Actually wait, the page itself has the FAB for mobile. Removing it from layout. */}
    </>
  );
}
