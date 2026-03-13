import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import './admin.css';

const menuItems = [
  { path: '/admin', label: 'Tableau de bord', icon: 'fa-chart-line' },
  { path: '/admin/livres', label: 'Livres', icon: 'fa-book' },
  { path: '/admin/commandes', label: 'Commandes', icon: 'fa-shopping-cart' },
  { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'fa-users' },
  { path: '/admin/parametres', label: 'Paramètres', icon: 'fa-cog' },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setShowLogoutModal(false);
    navigate('/shop-login', { replace: true });
  };

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo" style={{ whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif' }}>
            <span className="admin-logo-text"><i className="fa fa-book"></i> Dis-moi Papa</span>
          </Link>
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <i className={`fa fa-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
          </button>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span className="admin-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-external-link-alt"></i>
            <span className="admin-nav-label">Voir le site</span>
          </Link>
          <button
            type="button"
            className="admin-nav-link admin-nav-link-logout"
            onClick={handleLogoutClick}
            aria-label="Se déconnecter"
          >
            <i className="fa-solid fa-sign-out-alt"></i>
            <span className="admin-nav-label">Se déconnecter</span>
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Navbar className="admin-topbar" expand="lg">
          <Container fluid>
            <Navbar.Brand className="admin-topbar-title">Administration</Navbar.Brand>
            <Nav className="ms-auto align-items-center">
              <span className="admin-user-badge me-2">
                <i className="fa fa-user-circle me-1"></i>
                Admin
              </span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLogoutClick}
              >
                <i className="fa-solid fa-sign-out-alt me-1"></i>
                Se déconnecter
              </button>
            </Nav>
          </Container>
        </Navbar>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      <LogoutConfirmModal
        show={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default AdminLayout;
