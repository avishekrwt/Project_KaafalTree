import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard, CalendarDays, Bed, Utensils, Image as ImageIcon, MessageSquare, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';
import '../LoadingSpinner.css';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: <CalendarDays size={20} /> },
  { to: '/admin/rooms', label: 'Rooms', icon: <Bed size={20} /> },
  { to: '/admin/menu', label: 'Menu', icon: <Utensils size={20} /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
  { to: '/admin/testimonials', label: 'Testimonials', icon: <Star size={20} /> },
  { to: '/admin/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="admin-shell">
      {/* Mobile Header */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-header__logo">
          <span className="admin-sidebar__eyebrow">Kaafal Tree</span>
        </div>
        <button 
          className="admin-mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <p className="admin-sidebar__eyebrow">Kaafal Tree</p>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="admin-sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            >
              <span className="admin-sidebar__link-icon">{link.icon}</span>
              <span className="admin-sidebar__link-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <User size={18} />
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{admin?.username || 'Admin'}</p>
              <p className="admin-user-email">{admin?.email}</p>
            </div>
          </div>
          <button type="button" className="btn btn-outline admin-logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
