import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = '[Sin datos]',
  description = 'Conecta tu fuente de datos para ver informacion aqui.',
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-neutral-600"
           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Icon size={20} />
      </div>
      <div className="text-sm font-medium text-neutral-400">{title}</div>
      <p className="mt-1 max-w-sm text-sm text-neutral-600">{description}</p>
    </div>
  );
}
