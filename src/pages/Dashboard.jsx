import StatCard from '../components/StatCard.jsx';
import ContentCard from '../components/ContentCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight metallic-text">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Vista general de tu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clientes activos" />
        <StatCard label="Proyectos" />
        <StatCard label="Revenue (MTD)" />
        <StatCard label="Engagement" />
      </div>

      <ContentCard title="Resumen">
        <EmptyState
          title="Panel principal"
          description="Conecta tus herramientas para ver metricas en tiempo real."
        />
      </ContentCard>
    </div>
  );
}
