'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { ExerciseSearchInput, type ExerciseSearchDetails } from './ExerciseSearchInput';
import {
  coerceRoutineExercises,
  normalizeScheduledDays,
  ROUTINE_GOALS,
  SCHEDULED_DAYS,
  type RoutineExercise,
  type RoutineGoal,
  type RoutineRecord,
} from '@/lib/domain/routines';
import type { ActionState } from '@/lib/types/actions';

interface RoutineFormProps {
  mode: 'create' | 'edit'
  routine?: RoutineRecord
  cancelHref: string
  heading: string
  submitLabel: string
  onSubmitAction: (formData: FormData) => Promise<ActionState | void>
}

const DEFAULT_EXERCISES: RoutineExercise[] = [
  {
    id: '1',
    name: 'Barbell Back Squat',
    category: 'Compound / Quads',
    sets: 4,
    reps: 8,
    load: 100,
    rest: 120,
  },
]

const GOAL_OPTIONS: Array<{ label: string; value: RoutineGoal }> = [
  { label: 'Fuerza y Potencia', value: 'Strength & Power' },
  { label: 'Hipertrofia Muscular', value: 'Hypertrophy' },
  { label: 'Resistencia y Acondicionamiento', value: 'Endurance' },
  { label: 'Recuperación Activa', value: 'Recovery' },
]

export function RoutineForm({
  mode,
  routine,
  cancelHref,
  heading,
  submitLabel,
  onSubmitAction,
}: RoutineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>(
    routine ? normalizeScheduledDays(routine.scheduled_days || []) : ['Lun', 'Mie', 'Vie']
  );
  const [exercises, setExercises] = useState<RoutineExercise[]>(
    routine ? coerceRoutineExercises(routine.exercises || []) : DEFAULT_EXERCISES
  );

  const handleDayToggle = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((currentDay) => currentDay !== day) : [...prev, day]
    );
  };

  const addExercise = () => {
    const newId = (exercises.length + 1).toString();
    setExercises([
      ...exercises,
      {
        id: newId,
        name: 'New Movement',
        category: 'Accessory',
        sets: 3,
        reps: 10,
        load: 0,
        rest: 60,
      },
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const updateExercise = (id: string, field: keyof RoutineExercise, value: string | number) => {
    setExercises(exercises.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise)));
  };

  const updateExerciseData = (id: string, updates: Partial<RoutineExercise>) => {
    setExercises(exercises.map((exercise) => (exercise.id === id ? { ...exercise, ...updates } : exercise)));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append('exercises', JSON.stringify(exercises));
    formData.append('scheduled_days', JSON.stringify(activeDays));

    startTransition(async () => {
      setSubmitError(null);
      const result = await onSubmitAction(formData);
      if (result?.error) {
        setSubmitError(result.error);
      }
    });
  };

  const selectedGoal = (routine?.goal as RoutineGoal | null) && ROUTINE_GOALS.includes(routine.goal as RoutineGoal)
    ? (routine.goal as RoutineGoal)
    : 'Strength & Power';

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link href={cancelHref} className="text-on-surface-variant transition-colors active:scale-95 hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </Link>
          <h1 className="text-xl font-headline font-bold tracking-tight text-primary lg:text-3xl">{heading}</h1>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-primary-container px-6 py-2 font-headline font-bold text-on-primary-fixed transition-transform hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : submitLabel}
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-5">
          {submitError && (
            <div className="rounded-2xl border border-error/20 bg-error/10 px-5 py-4 text-sm font-bold text-error">
              {submitError}
            </div>
          )}

          <section>
            <h2 className="mb-8 px-1 text-3xl font-headline font-extrabold italic tracking-tighter text-primary">LABORATORY_CORE</h2>
            <div className="space-y-6">
              <div className="group">
                <label className="ml-1 mb-2 block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant">
                  Nombre de la Rutina
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={routine?.title}
                  required
                  placeholder="ej. Fase A de Hipertrofia"
                  className="w-full rounded-xl border-none bg-surface-container-lowest p-4 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-dim/20"
                />
              </div>

              <div className="group">
                <label className="ml-1 mb-2 block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant">
                  Objetivo Principal
                </label>
                <select
                  name="goal"
                  defaultValue={selectedGoal}
                  className="w-full appearance-none rounded-xl border-none bg-surface-container-lowest p-4 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-dim/20"
                >
                  {GOAL_OPTIONS.map((goalOption) => (
                    <option key={goalOption.value} value={goalOption.value}>
                      {goalOption.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="ml-1 mb-2 block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant">
                  Descripción
                </label>
                <textarea
                  name="description"
                  defaultValue={routine?.description ?? ''}
                  required
                  rows={4}
                  placeholder="Concéntrate en el control excéntrico y movimientos concéntricos explosivos..."
                  className="w-full resize-none rounded-xl border-none bg-surface-container-lowest p-4 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-dim/20"
                />
              </div>
            </div>
          </section>

          <section>
            <label className="ml-1 mb-4 block text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant">
              Días de Entrenamiento
            </label>
            <div className="flex flex-wrap gap-3">
              {SCHEDULED_DAYS.map((day) => {
                const isActive = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                      isActive ? 'bg-primary text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </section>

          {mode === 'create' && (
            <div className="relative overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-low p-8">
              <div className="relative z-10">
                <span className="material-symbols-outlined mb-4 text-4xl text-secondary">analytics</span>
                <h3 className="mb-2 text-xl font-headline font-bold text-on-surface">Requisitos Configurados</h3>
                <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                  Al presionar Guardar, este protocolo se guardará en tu base de datos y aparecerá inmediatamente en tu panel de Entrenamientos.
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div className="h-full w-full bg-secondary shadow-[0_0_10px_rgba(103,156,255,0.4)]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="mb-8 flex flex-col gap-4 px-1 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-headline font-extrabold italic tracking-tighter text-on-surface">PROTOCOLO_SECUENCIA</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Configura los parámetros del flujo de ejercicios</p>
            </div>
            <button
              type="button"
              onClick={addExercise}
              className="group flex w-fit items-center gap-2 font-headline font-bold text-primary-dim transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add_circle</span>
              AGREGAR EJERCICIO
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="group rounded-[2rem] border border-transparent bg-surface-container p-6 transition-all hover:border-outline-variant/10 hover:bg-surface-container-high"
              >
                <div className="flex items-start gap-4">
                  {mode === 'create' && (
                    <div className="hidden cursor-grab pt-2 text-on-surface-variant transition-colors group-hover:text-primary lg:block active:cursor-grabbing">
                      <span className="material-symbols-outlined">drag_indicator</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="mr-4 flex w-full items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/10 bg-white shadow-sm">
                          {(() => {
                            const gifToShow = exercise.gifUrl || (exercise.id.length === 4 ? `/api/exercises/image/${exercise.id}` : null);
                            return gifToShow ? (
                              <Image
                                src={gifToShow}
                                alt={exercise.name}
                                fill
                                unoptimized
                                className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-surface-container-highest">
                                <span className="material-symbols-outlined text-3xl text-outline-variant">fitness_center</span>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex-1">
                          <ExerciseSearchInput
                            value={exercise.name}
                            onChange={(name: string, details?: ExerciseSearchDetails) => {
                              if (details) {
                                updateExerciseData(exercise.id, {
                                  name,
                                  gifUrl: details.gifUrl,
                                  instructions: details.instructions,
                                  target: details.target,
                                  category: details.target || details.bodyPart || 'General',
                                });
                                return;
                              }

                              updateExerciseData(exercise.id, { name });
                            }}
                            className="w-full border-none bg-transparent p-0 font-headline text-lg font-bold text-on-surface focus:ring-0"
                            placeholder="Buscar o escribir ejercicio..."
                          />
                          <input
                            type="text"
                            value={exercise.category}
                            onChange={(event) => updateExercise(exercise.id, 'category', event.target.value)}
                            className="mt-1 w-full border-none bg-transparent p-0 text-[10px] font-bold uppercase tracking-widest text-secondary focus:ring-0"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(exercise.id)}
                        className="mt-2 shrink-0 text-on-surface-variant transition-colors hover:text-error"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      <RoutineNumberInput
                        label="Series"
                        value={exercise.sets}
                        onChange={(value) => updateExercise(exercise.id, 'sets', value)}
                      />
                      <RoutineNumberInput
                        label="Reps"
                        value={exercise.reps}
                        onChange={(value) => updateExercise(exercise.id, 'reps', value)}
                      />
                      <RoutineNumberInput
                        label="Carga (kg)"
                        value={exercise.load}
                        onChange={(value) => updateExercise(exercise.id, 'load', value)}
                      />
                      <RoutineNumberInput
                        label="Descanso (s)"
                        value={exercise.rest}
                        onChange={(value) => updateExercise(exercise.id, 'rest', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExercise}
              className="group mt-6 flex w-full flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-outline-variant/20 p-8 text-on-surface-variant transition-all hover:border-primary-dim/40 hover:bg-surface-container-low"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-primary-dim">add</span>
              </div>
              <span className="text-sm font-headline font-bold uppercase tracking-widest">Añadir paso al protocolo</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

interface RoutineNumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function RoutineNumberInput({ label, value, onChange }: RoutineNumberInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number.parseInt(event.target.value, 10) || 0)}
        className="w-full rounded-xl border-none bg-surface-container-lowest py-2 text-center font-bold text-primary outline-none focus:ring-1 focus:ring-primary/20"
      />
    </div>
  )
}
