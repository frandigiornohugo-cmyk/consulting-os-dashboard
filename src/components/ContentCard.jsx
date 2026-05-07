export default function ContentCard({ title, action, children, className = '' }) {
  return (
    <section className={`glass-card rounded-xl ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {title && (
            <h2 className="text-sm font-semibold tracking-tight text-neutral-300">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
