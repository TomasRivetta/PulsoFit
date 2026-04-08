'use client';

import { useState, useTransition } from 'react';
import { deleteRoutineAction } from '../actions';
import { Modal } from '@/app/components/Modal';

export function DeleteButton({ routineId }: { routineId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(false);
    startTransition(() => {
      deleteRoutineAction(routineId);
    });
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className={`flex-1 flex items-center justify-center p-4 bg-surface-container rounded-xl transition-all ${isPending ? 'opacity-50' : 'text-error-dim hover:text-error hover:bg-surface-container-high'}`}
      >
        <span className="material-symbols-outlined">{isPending ? 'hourglass_empty' : 'delete'}</span>
      </button>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-error text-4xl">warning</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-headline font-semibold">¿Eliminar rutina?</h3>
            <p className="text-on-surface-variant text-sm">
              Esta acción no se puede deshacer. Perderás todo el progreso y configuración de esta rutina.
            </p>
          </div>

          <div className="flex w-full gap-3 pt-4">
            <button 
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-3 rounded-xl border border-outline-variant/30 font-medium hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 px-4 py-3 rounded-xl bg-error text-white font-medium hover:bg-error-dim transition-colors shadow-lg shadow-error/20"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
