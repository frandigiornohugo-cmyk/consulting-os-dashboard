import { MessageCircle } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function FranVirtual() {
  return (
    <EmptyState
      icon={MessageCircle}
      title="Fran Virtual"
      description="Tu consultor personal con IA. Conecta la API de Claude para activarlo."
    />
  );
}
