import React from 'react';
import PrincipalSidebar from './PrincipalSidebar';
import PrincipalDashboard from './principal-dashboard';

const PrincipalLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <PrincipalSidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <PrincipalDashboard />
      </div>
    </div>
  );
};

export default PrincipalLayout;
