import { GraduationCap } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function Course() {
  return (
    <EmptyState
      icon={GraduationCap}
      title="Programa"
      description="Modulos, lecciones y progreso de tus clientes. Reemplaza Skool."
    />
  );
}
