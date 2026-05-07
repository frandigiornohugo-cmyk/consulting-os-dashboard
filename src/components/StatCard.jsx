export default function StatCard({
  label = '[Metrica]',
  value = '—',
  delta = '',
  deltaTone = 'neutral',
}) {
  const toneClasses = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-neutral-600',
  }[deltaTone];

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 transition-all duration-200">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight metallic-text">
          {value}
        </div>
        {delta && <div className={`text-xs font-medium ${toneClasses}`}>{delta}</div>}
      </div>
    </div>
  );
}
