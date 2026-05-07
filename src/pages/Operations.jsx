import { ClipboardList } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function Operations() {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Operaciones"
      description="Checklists de implementacion, SOPs y estados por cliente."
    />
  );
}
