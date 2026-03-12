import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
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
  const location = useLocation();

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
        </div>
      </aside>
      <div className="admin-main">
        <Navbar className="admin-topbar" expand="lg">
          <Container fluid>
            <Navbar.Brand className="admin-topbar-title">Administration</Navbar.Brand>
            <Nav className="ms-auto">
              <span className="admin-user-badge">
                <i className="fa fa-user-circle me-1"></i>
                Admin
              </span>
            </Nav>
          </Container>
        </Navbar>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
