import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/upload', label: 'Enviar BU', icon: '📤', roles: ['inspector'] },
  { path: '/boletins', label: 'Boletins de Urna', icon: '📋' },
  { path: '/resultados', label: 'Resultados', icon: '🗳️' },
];

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/upload': 'Enviar Boletim de Urna',
  '/boletins': 'Boletins de Urna',
  '/resultados': 'Resultados da Eleição',
};

const roleLabels: Record<string, string> = {
  inspector: 'Inspetor Local',
  analyst: 'Equipe Central',
};

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const pageTitle = pageTitles[location.pathname] ?? 'BU Monitor';

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <div className="app-layout">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>🗳️ BU Monitor</h1>
          <span>Sistema de Apuração Paralela</span>
        </div>

        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Usuário logado */}
        {user && (
          <div className="sidebar-footer">
            <div style={{ marginBottom: 4 }}>
              <span
                style={{
                  display: 'inline-block',
                  background: user.role === 'inspector' ? '#1a56db' : '#057a55',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 4,
                  marginBottom: 4,
                }}
              >
                {roleLabels[user.role]}
              </span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--color-gray-200)', fontSize: 13 }}>
              {user.name}
            </div>
            <div style={{ color: 'var(--color-gray-500)', fontSize: 11, marginTop: 2 }}>
              {user.email}
            </div>
            <button
              onClick={logout}
              style={{
                marginTop: 10,
                width: '100%',
                padding: '6px',
                background: 'transparent',
                border: '1px solid var(--color-gray-600)',
                borderRadius: 6,
                color: 'var(--color-gray-400)',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = 'var(--color-gray-700)';
                (e.target as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = 'transparent';
                (e.target as HTMLButtonElement).style.color = 'var(--color-gray-400)';
              }}
            >
              🚪 Sair
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn btn-secondary"
              style={{ display: 'none', padding: '6px 10px' }}
              id="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menu"
            >
              ☰
            </button>
            <span className="topbar-title">{pageTitle}</span>
          </div>
          <div className="topbar-meta">
            {user && (
              <span style={{ fontWeight: 500, color: 'var(--color-gray-700)' }}>
                👤 {user.name}
              </span>
            )}
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#057a55',
              }}
            />
            Dados simulados (protótipo)
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu button via CSS */}
      <style>{`
        @media (max-width: 768px) {
          #menu-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
