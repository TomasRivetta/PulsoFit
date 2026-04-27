import { createRoutineAction } from '../actions';
import { RoutineForm } from '../components/RoutineForm';

export default function NewRoutinePage() {
  return (
    <RoutineForm
      mode="create"
      cancelHref="/dashboard/routines"
      heading="Crear Rutina"
      submitLabel="Guardar Rutina"
      onSubmitAction={createRoutineAction}
    />
  );
}
