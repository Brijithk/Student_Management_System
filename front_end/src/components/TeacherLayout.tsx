import React from 'react';
import TeacherDashboard from './Teacher-dashboard';
import TeacherSidebar from './TeacherSidebar';

const TeacherLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <TeacherSidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <TeacherDashboard />
      </div>
    </div>
  );
};

export default TeacherLayout;
