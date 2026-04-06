'use client';

import { useTransition } from 'react';
import { deleteRoutineAction } from '../actions';

export function DeleteButton({ routineId }: { routineId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
      startTransition(() => {
        deleteRoutineAction(routineId);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`flex-1 flex items-center justify-center p-4 bg-surface-container rounded-xl transition-all ${isPending ? 'opacity-50' : 'text-error-dim hover:text-error hover:bg-surface-container-high'}`}
    >
      <span className="material-symbols-outlined">{isPending ? 'hourglass_empty' : 'delete'}</span>
    </button>
  );
}
