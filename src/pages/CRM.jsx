import { Contact } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function CRM() {
  return (
    <EmptyState
      icon={Contact}
      title="CRM"
      description="Pipeline de ventas y directorio de clientes. Leads, calls, cierres."
    />
  );
}
