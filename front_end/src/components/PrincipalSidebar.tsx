import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // optional: same styles as teacher

const PrincipalSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Principal Panel</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/principal-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/teacher-accounts">Manage Teachers</Link>
        </li>
        <li>
          <Link to="/view-students">View Students</Link>
        </li>
        <li>
          <Link to="/generate-credentials">Generate Login Credentials</Link>
        </li>
        <li>
          <Link to="/" onClick={() => localStorage.removeItem('token')}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PrincipalSidebar;
