import { NavLink, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  Home,
  CalendarDays,
  BarChart3,
  GraduationCap,
  ClipboardList,
  DollarSign,
  Contact,
  MessageCircle,
  Link2,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';

const NAV_MAIN = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/content-calendar', label: 'Contenido', icon: CalendarDays, chevron: true },
  { to: '/operations', label: 'Operaciones', icon: ClipboardList, chevron: true },
  { to: '/crm', label: 'Ventas', icon: Contact, chevron: true },
  { to: '/revenue', label: 'Finanzas', icon: DollarSign, chevron: true },
];

const NAV_BOTTOM = [
  { to: '/metrics', label: 'Metricas', icon: BarChart3 },
  { to: '/course', label: 'Programa', icon: GraduationCap },
  { to: '/fran-virtual', label: 'Fran Virtual', icon: MessageCircle },
  { to: '/settings', label: 'Conexiones', icon: Link2 },
  { to: '/settings', label: 'Configuracion', icon: SettingsIcon },
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const firstName = user?.firstName || 'Usuario';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex flex-col sidebar-gradient transition-all duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0',
          collapsed ? 'md:w-16' : 'md:w-64',
          'w-64',
        ].join(' ')}
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
        aria-label="Primary"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-2">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg"
               style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-sm font-bold metallic-text">S</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-neutral-400">
              Consulting OS
            </span>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto rounded-md p-1 text-neutral-500 hover:text-neutral-300 md:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Welcome */}
        {!collapsed && (
          <div className="px-5 pt-4 pb-5">
            <h2 className="text-2xl font-bold metallic-text leading-tight">
              Bienvenido,<br />{firstName}
            </h2>
            <p className="mt-1 text-xs text-neutral-600">
              Ultimo acceso: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        )}

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-0.5">
            {NAV_MAIN.map(({ to, label, icon: Icon, end, chevron }) => (
              <li key={to + label}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    [
                      'nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'nav-active text-white'
                        : 'text-neutral-500 hover:text-neutral-300',
                      collapsed ? 'md:justify-center md:px-2' : '',
                    ].join(' ')
                  }
                >
                  <Icon size={17} className="flex-none opacity-70" />
                  <span className={collapsed ? 'md:hidden' : 'flex-1'}>{label}</span>
                  {chevron && !collapsed && (
                    <ChevronRight size={14} className="opacity-30" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <ul className="space-y-0.5 pt-3">
            {NAV_BOTTOM.map(({ to, label, icon: Icon }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    [
                      'nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
                      isActive
                        ? 'text-neutral-300'
                        : 'text-neutral-600 hover:text-neutral-400',
                      collapsed ? 'md:justify-center md:px-2' : '',
                    ].join(' ')
                  }
                >
                  <Icon size={16} className="flex-none" />
                  <span className={collapsed ? 'md:hidden' : ''}>{label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => signOut()}
                className="nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:text-neutral-400 transition-all duration-150"
              >
                <LogOut size={16} className="flex-none" />
                {!collapsed && <span>Salir</span>}
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
