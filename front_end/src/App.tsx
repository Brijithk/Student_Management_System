import React from 'react';
import './App.css';
import Login from './components/login';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';
import EditStudent from './components/EditStudent';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SignUp from './components/SignUp';
import PrincipalDashboard from './components/principal-dashboard';
import TeacherDashboard from './components/Teacher-dashboard';
import TeacherTable from './components/TeacherTable';
import TeacherList from './components/TeacherList';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

const noSidebarRoutes = ["/", "/signup"];
const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/:classId" element={<UserManagement />} />
            {/* <Route path="/edit/:roll" element={<EditStudent />} /> */}
             <Route path="/signup" element={<SignUp />} />
                     <Route path="/teacherTable" element={<TeacherTable />} />
             <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
<Route path="/teacher-dashboard" element={<TeacherDashboard />} />
<Route path="/TeacherList" element={<TeacherList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
