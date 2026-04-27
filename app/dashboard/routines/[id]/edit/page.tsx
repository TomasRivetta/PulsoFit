import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EditClientForm } from './EditClientForm';
import type { RoutineRecord } from '@/lib/domain/routines';

export default async function EditRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: routine } = await supabase.from('routines').select('*').eq('id', id).single();

  if (!routine) redirect('/dashboard/routines');

  return <EditClientForm routine={routine as RoutineRecord} />;
}
