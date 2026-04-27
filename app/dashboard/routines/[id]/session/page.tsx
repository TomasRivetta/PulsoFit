import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WorkoutSessionClient from './WorkoutSessionClient';
import type { RoutineRecord } from '@/lib/domain/routines';

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: routine } = await supabase
    .from('routines')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!routine) {
    redirect('/dashboard/routines');
  }

  return (
    <div className="h-screen w-full bg-surface text-on-surface flex flex-col overflow-hidden relative">
      <WorkoutSessionClient routine={routine as RoutineRecord} />
    </div>
  );
}
