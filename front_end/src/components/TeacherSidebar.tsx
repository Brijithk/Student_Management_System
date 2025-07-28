import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // optional: reuse same styles or customize

const TeacherSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Teacher Panel</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/teacher-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/students">Manage Students</Link>
        </li>
        <li>
          <Link to="/attendance">Attendance</Link>
        </li>
        <li>
          <Link to="/marks">Marks Entry</Link>
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

export default TeacherSidebar;
