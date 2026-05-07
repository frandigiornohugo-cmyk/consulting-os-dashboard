import { CalendarDays } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function ContentCalendar() {
  return (
    <EmptyState
      icon={CalendarDays}
      title="Calendario de Contenido"
      description="Planifica y organiza tu contenido por semana. Conecta tu cuenta para empezar."
    />
  );
}
