import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DeleteButton } from './DeleteButton';
import { coerceRoutineExercises, getRoutineTheme, type RoutineRecord } from '@/lib/domain/routines';

export default async function RoutineDetailedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: routine } = await supabase.from('routines').select('*').eq('id', id).single();

  if (!routine) redirect('/dashboard/routines');

  const typedRoutine = routine as RoutineRecord
  const exercises = coerceRoutineExercises(typedRoutine.exercises)
  const theme = getRoutineTheme(typedRoutine.color_theme)
  
  // Calculate total volume estimate: sum of (sets * reps * load)
  const totalVolume = exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps * ex.load), 0);
  const avgDuration = typedRoutine.duration_mins || 60;

  return (
    <>
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
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${theme.badge}`}>
                {typedRoutine.goal}
              </span>
              <span className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">• {typedRoutine.frequency_days} Días / Semana</span>
            </div>
            <h1 className={`text-4xl lg:text-7xl font-black font-headline tracking-tighter leading-none mb-6 italic ${theme.title}`}>
              {typedRoutine.title.toUpperCase()}
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-body">
              {typedRoutine.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:flex-col lg:min-w-[200px]">
            <Link href={`/dashboard/routines/${typedRoutine.id}/session`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-br from-primary-container to-primary-dim text-on-primary-fixed font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(202,253,0,0.2)] hover:shadow-[0_0_30px_rgba(202,253,0,0.3)] transition-all active:scale-95">
              <span className="material-symbols-outlined">play_arrow</span>
              INICIAR RUTINA
            </Link>
            <div className="flex gap-3">
              <Link href={`/dashboard/routines/${typedRoutine.id}/edit`} className="flex-1 flex items-center justify-center p-4 bg-surface-container rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined">edit</span>
              </Link>
              <DeleteButton routineId={typedRoutine.id} />
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
            <p className="text-2xl font-black font-headline text-secondary tracking-tighter uppercase">{typedRoutine.difficulty}</p>
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
            <span className="text-primary text-sm font-bold uppercase tracking-[0.2em]">{typedRoutine.goal}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercises.map((ex) => (
              <div key={ex.id} className="bg-surface-container group hover:bg-surface-container-high transition-colors rounded-[2rem] overflow-hidden p-6 flex flex-col justify-between min-h-[220px] border border-transparent hover:border-outline-variant/10">
                <div className="flex flex-col sm:flex-row gap-6">
                  {(() => {
                    const gifToShow = ex.gifUrl || (ex.id.length === 4 ? `/api/exercises/image/${ex.id}` : null);
                    return gifToShow ? (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl flex-shrink-0 overflow-hidden relative">
                        <Image 
                          src={gifToShow} 
                          alt={`Demostración de ${ex.name}`} 
                          fill
                          unoptimized
                          className="w-full h-full object-cover mix-blend-multiply absolute inset-0"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-surface-container-highest rounded-2xl flex-shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-outline-variant">fitness_center</span>
                      </div>
                    );
                  })()}

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-bold font-headline leading-tight capitalize">{ex.name}</h3>
                        {ex.target && (
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-widest uppercase">
                              {ex.target}
                            </span>
                            <span className="text-[10px] font-bold bg-surface-variant/30 text-on-surface-variant px-2 py-0.5 rounded tracking-widest uppercase">
                              {ex.category}
                            </span>
                          </div>
                        )}
                        {!ex.target && (
                          <span className="text-[10px] mt-1 font-bold bg-primary-container/20 text-primary-fixed-dim px-2 py-1 uppercase rounded tracking-widest inline-block">
                            {ex.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-6 lg:gap-8 mb-4">
                      <div>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Series</p>
                        <p className="text-2xl font-black font-headline text-on-surface">{ex.sets}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Reps</p>
                        <p className="text-2xl font-black font-headline text-on-surface">{ex.reps}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Peso</p>
                        <p className="text-2xl font-black font-headline text-primary">{ex.load} <span className="text-xs font-normal">kg</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">timer</span>
                    <span>Descanso {ex.rest}s entre series.</span>
                  </div>
                  {ex.instructions && ex.instructions.length > 0 && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-primary uppercase font-bold tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">info</span> Técnica Disp.
                      </span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
