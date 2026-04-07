'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { createRoutineAction } from '../actions';

interface RoutineExercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  load: number;
  rest: number;
}

export default function NewRoutinePage() {
  const [isPending, startTransition] = useTransition();
  const [activeDays, setActiveDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [exercises, setExercises] = useState<RoutineExercise[]>([
    {
      id: '1',
      name: 'Barbell Back Squat',
      category: 'Compound / Quads',
      sets: 4,
      reps: 8,
      load: 100,
      rest: 120
    }
  ]);

  const handleDayToggle = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addExercise = () => {
    const newId = (exercises.length + 1).toString();
    setExercises([...exercises, {
      id: newId,
      name: 'New Movement',
      category: 'Accessory',
      sets: 3,
      reps: 10,
      load: 0,
      rest: 60
    }]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof RoutineExercise, value: string | number) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('exercises', JSON.stringify(exercises));
    formData.append('frequency', activeDays.length.toString());
    formData.append('scheduled_days', JSON.stringify(activeDays));
    
    startTransition(() => {
      createRoutineAction(formData);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/routines" className="text-on-surface-variant hover:text-primary transition-colors active:scale-95">
            <span className="material-symbols-outlined">close</span>
          </Link>
          <h1 className="font-headline font-bold tracking-tight text-primary text-xl lg:text-3xl">Crear Rutina</h1>
        </div>
        <button 
          type="submit"
          disabled={isPending}
          className="bg-primary-container text-on-primary-fixed font-headline font-bold px-6 py-2 rounded-xl active:scale-95 transition-transform hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar Rutina'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-5 space-y-10">
          <section>
            <h2 className="font-headline text-3xl font-extrabold italic tracking-tighter text-primary mb-8 px-1">LABORATORY_CORE</h2>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant mb-2 ml-1">Nombre de la Rutina</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="ej. Fase A de Hipertrofia" 
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary-dim/20 transition-all placeholder:text-on-surface-variant/40 outline-none" 
                />
              </div>
              <div className="group">
                <label className="block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant mb-2 ml-1">Objetivo Principal</label>
                <select name="goal" className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary-dim/20 transition-all appearance-none outline-none">
                  <option value="Strength & Power">Fuerza y Potencia</option>
                  <option value="Hypertrophy">Hipertrofia Muscular</option>
                  <option value="Endurance">Resistencia y Acondicionamiento</option>
                  <option value="Recovery">Recuperación Activa</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant mb-2 ml-1">Descripción</label>
                <textarea 
                  name="description"
                  required
                  rows={4} 
                  placeholder="Concéntrate en el control excéntrico y movimientos concéntricos explosivos..." 
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary-dim/20 transition-all placeholder:text-on-surface-variant/40 resize-none outline-none"
                ></textarea>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant mb-4 ml-1">Días de Entrenamiento</label>
            <div className="flex flex-wrap gap-3">
              {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => {
                const isActive = activeDays.includes(day);
                return (
                  <button 
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                      isActive 
                      ? 'bg-primary text-on-primary-fixed' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/10 relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-secondary text-4xl mb-4">analytics</span>
              <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Requisitos Configurados</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Al presionar Guardar, este protocolo se guardará en tu base de datos y aparecerá inmediatamente en tu panel de Entrenamientos.
              </p>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-full shadow-[0_0_10px_rgba(103,156,255,0.4)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exercise Sequence */}
        <div className="lg:col-span-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-1">
            <div>
              <h2 className="font-headline text-3xl font-extrabold italic tracking-tighter text-on-surface">PROTOCOLO_SECUENCIA</h2>
              <p className="text-on-surface-variant text-sm mt-1">Configura los parámetros del flujo de ejercicios</p>
            </div>
            <button 
              type="button"
              onClick={addExercise}
              className="flex items-center w-fit gap-2 text-primary-dim font-headline font-bold hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
              AGREGAR EJERCICIO
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="group bg-surface-container rounded-[2rem] p-6 hover:bg-surface-container-high transition-all border border-transparent hover:border-outline-variant/10">
                <div className="flex items-start gap-4">
                  <div className="cursor-grab active:cursor-grabbing text-on-surface-variant pt-2 group-hover:text-primary transition-colors lg:block hidden">
                    <span className="material-symbols-outlined">drag_indicator</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4 w-full mr-4">
                        <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0">
                          <span className="material-symbols-outlined text-outline-variant text-3xl">fitness_center</span>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={exercise.name} 
                            onChange={e => updateExercise(exercise.id, 'name', e.target.value)}
                            className="font-headline font-bold text-lg text-on-surface bg-transparent border-none p-0 focus:ring-0 w-full"
                          />
                          <input 
                            type="text"
                            value={exercise.category}
                            onChange={e => updateExercise(exercise.id, 'category', e.target.value)}
                            className="text-[10px] font-label uppercase tracking-widest text-secondary font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeExercise(exercise.id)} className="text-on-surface-variant hover:text-error transition-colors mt-2 shrink-0">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Series</label>
                        <input 
                          type="number" 
                          value={exercise.sets}
                          onChange={e => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                          className="w-full bg-surface-container-lowest border-none rounded-xl text-center py-2 font-bold text-primary outline-none focus:ring-1 focus:ring-primary/20" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Reps</label>
                        <input 
                          type="number" 
                          value={exercise.reps}
                          onChange={e => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-full bg-surface-container-lowest border-none rounded-xl text-center py-2 font-bold text-primary outline-none focus:ring-1 focus:ring-primary/20" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Carga (kg)</label>
                        <input 
                          type="number" 
                          value={exercise.load}
                          onChange={e => updateExercise(exercise.id, 'load', parseInt(e.target.value) || 0)}
                          className="w-full bg-surface-container-lowest border-none rounded-xl text-center py-2 font-bold text-primary outline-none focus:ring-1 focus:ring-primary/20" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Descanso (s)</label>
                        <input 
                          type="number" 
                          value={exercise.rest}
                          onChange={e => updateExercise(exercise.id, 'rest', parseInt(e.target.value) || 0)}
                          className="w-full bg-surface-container-lowest border-none rounded-xl text-center py-2 font-bold text-primary outline-none focus:ring-1 focus:ring-primary/20" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Exercise CTA */}
            <button 
              type="button"
              onClick={addExercise}
              className="w-full border-2 border-dashed border-outline-variant/20 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-surface-container-low hover:border-primary-dim/40 transition-all group mt-6"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary-dim">add</span>
              </div>
              <span className="font-headline font-bold text-sm uppercase tracking-widest">Añadir paso al protocolo</span>
            </button>

          </div>
        </div>
      </div>
    </form>
  );
}
