import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DeleteButton } from './DeleteButton';

interface RoutineExercise {
  id: string;
  load: number;
  name: string;
  reps: number;
  rest: number;
  sets: number;
  category: string;
}

export default async function RoutineDetailedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: routine } = await supabase.from('routines').select('*').eq('id', id).single();

  if (!routine) redirect('/dashboard/routines');

  const exercises = (routine.exercises as any as RoutineExercise[]) || [];
  
  // Calculate total volume estimate: sum of (sets * reps * load)
  const totalVolume = exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps * ex.load), 0);
  // Avg duration calculated (very simple pseudo formula) or use routine.duration_mins
  const avgDuration = routine.duration_mins || 60;

  return (
    <>
      {/* Top action header for mobile navigation mostly */}
      <div className="flex items-center gap-4 mb-8 hidden">
        <Link href="/dashboard/routines" className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
      </div>

      <section className="relative mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link href="/dashboard/routines" className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 lg:hidden">
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <span className={`bg-${routine.color_theme || 'primary'}/10 text-${routine.color_theme || 'primary'} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest`}>
                {routine.goal}
              </span>
              <span className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">• {routine.frequency_days} Días / Semana</span>
            </div>
            <h1 className={`text-4xl lg:text-7xl font-black font-headline tracking-tighter leading-none mb-6 italic text-${routine.color_theme || 'primary'}`}>
              {routine.title.toUpperCase()}
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-body">
              {routine.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:flex-col lg:min-w-[200px]">
            <Link href={`/dashboard/routines/${routine.id}/session`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-br from-primary-container to-primary-dim text-on-primary-fixed font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(202,253,0,0.2)] hover:shadow-[0_0_30px_rgba(202,253,0,0.3)] transition-all active:scale-95">
              <span className="material-symbols-outlined">play_arrow</span>
              INICIAR RUTINA
            </Link>
            <div className="flex gap-3">
              <Link href={`/dashboard/routines/${routine.id}/edit`} className="flex-1 flex items-center justify-center p-4 bg-surface-container rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined">edit</span>
              </Link>
              <DeleteButton routineId={routine.id} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-surface-container-low p-6 rounded-2xl">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Carga Estimada</p>
            <p className="text-3xl font-black font-headline">{(totalVolume / 1000).toFixed(1)}k <span className="text-sm font-normal text-on-surface-variant">kg</span></p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Duración Promedio</p>
            <p className="text-3xl font-black font-headline">{avgDuration} <span className="text-sm font-normal text-on-surface-variant">min</span></p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Dificultad</p>
            <p className="text-2xl font-black font-headline text-secondary tracking-tighter uppercase">{routine.difficulty}</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Ejercicios</p>
            <p className="text-3xl font-black font-headline text-primary">{exercises.length}</p>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        <article>
          <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-8">
            <h2 className="text-4xl font-black font-headline italic tracking-tighter">EJERCICIOS</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-outline-variant/30 to-transparent hidden md:block"></div>
            <span className="text-primary text-sm font-bold uppercase tracking-[0.2em]">{routine.goal}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {exercises.map((ex) => (
              <div key={ex.id} className="bg-surface-container group hover:bg-surface-container-high transition-colors rounded-2xl overflow-hidden p-6 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl font-bold font-headline leading-tight">{ex.name}</h3>
                    <span className="text-[9px] font-bold bg-primary-container/20 text-primary-fixed-dim px-2 py-1 flex-shrink-0 uppercase whitespace-nowrap rounded tracking-widest">
                      {ex.category}
                    </span>
                  </div>
                  <div className="flex gap-6 lg:gap-8 mb-6">
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Series</p>
                      <p className="text-2xl font-black font-headline">{ex.sets}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Reps</p>
                      <p className="text-2xl font-black font-headline">{ex.reps}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Peso</p>
                      <p className="text-2xl font-black font-headline text-primary">{ex.load} <span className="text-xs font-normal">kg</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  <span>Descanso {ex.rest}s entre series.</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
