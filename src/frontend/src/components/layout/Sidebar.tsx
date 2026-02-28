import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const menuItems = [
  { path: '/', label: '儀表板', icon: '📊' },
  { path: '/machines', label: '機台管理', icon: '🎰' },
  { path: '/players', label: '玩家管理', icon: '👥' },
  { path: '/transactions', label: '交易管理', icon: '💰' },
  { path: '/providers', label: '遊戲商管理', icon: '🎮' },
  { path: '/agents', label: '代理商管理', icon: '🤝' },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>遊戲平台</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-name">{user?.username}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button onClick={logout} className="logout-btn">
          登出
        </button>
      </div>
    </aside>
  );
}
