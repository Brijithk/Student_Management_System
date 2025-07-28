import React, { useState } from 'react';
import { LayoutDashboard, Users } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';
import { User, ChevronRight, ChevronDown } from 'lucide-react';


const Sidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const username = localStorage.getItem('username');
  const location = useLocation();

  const isAllStudentsActive =
    location.pathname.startsWith('/users') || location.pathname.startsWith('/edit');

  return (
    <div className="sidebar">
      <p>{username === 'Admin' ? 'PRINCIPAL PANEL' : 'TEACHER PANEL'}</p>

      {/* Admin Dropdown */}
      {username === 'Admin' && (
        <div className="sidebar-item-with-dropdown">
           <NavLink
      to="/principal-dashboard"
      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    >
      <LayoutDashboard size={20} className="sidebar-layout sidebar-icon" />
      Dashboard
    </NavLink>
  <div
    onClick={() => setShowDropdown(prev => !prev)}
    className={`sidebar-item ${isAllStudentsActive ? '' : ''}`}
    style={{ cursor: 'pointer' }}
  >
    <User size={20} className="sidebar-layout sidebar-icon" />
    <span className="sidebar-text">All Students</span>
     {showDropdown ? (
    <ChevronDown size={18} />
  ) : (
    <ChevronRight size={18} />
  )}
  </div>

  <div
    className={`dropdown-container ${showDropdown ? 'show' : ''}`}
  >
    <NavLink
      to="/users/class10"
      className={({ isActive }) => `sidebar-subitem ${isActive ? 'active' : ''}`}
    >
      Class 10
    </NavLink>
    <NavLink
      to="/users/class12"
      className={({ isActive }) => `sidebar-subitem ${isActive ? 'active' : ''}`}
    >
      Class 12
    </NavLink>
  </div>
    <NavLink
      to="/TeacherList"
      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    >
      <Users size={20} className="sidebar-layout sidebar-icon" />
      All Teacher
    </NavLink>
</div>

      )}

      {/* Non-Admin Add Student */}
      {username !== 'Admin' && (
        <>
        <NavLink
      to="/teacher-dashboard"
      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    >
      <LayoutDashboard size={20} className="sidebar-layout sidebar-icon" />
      Dashboard
    </NavLink>
        <NavLink
          to="/teacherTable"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} className="sidebar-layout sidebar-icon" />
          <span className="sidebar-text">Table</span>
        </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
