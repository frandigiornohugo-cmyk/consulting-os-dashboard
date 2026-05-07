import { DollarSign } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function Revenue() {
  return (
    <EmptyState
      icon={DollarSign}
      title="Revenue"
      description="MRR, churn, LTV y revenue por cliente. Conecta Stripe para ver datos."
    />
  );
}
