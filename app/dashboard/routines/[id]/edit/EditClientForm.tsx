import { updateRoutineAction } from '../../actions';
import { RoutineForm } from '../../components/RoutineForm';
import type { RoutineRecord } from '@/lib/domain/routines';

export function EditClientForm({ routine }: { routine: RoutineRecord }) {
  return (
    <RoutineForm
      mode="edit"
      routine={routine}
      cancelHref={`/dashboard/routines/${routine.id}`}
      heading="Editar Rutina"
      submitLabel="Guardar Cambios"
      onSubmitAction={(formData) => updateRoutineAction(routine.id, formData)}
    />
  );
}
