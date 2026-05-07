import { BarChart3 } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function Metrics() {
  return (
    <EmptyState
      icon={BarChart3}
      title="Metricas de Contenido"
      description="Reach, saves, shares, likes, comments, watch time. Conecta Instagram para ver datos."
    />
  );
}
