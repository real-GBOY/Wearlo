import React, { useState } from 'react';
import { DashboardSidebar } from '../../organisms/DashboardSidebar/DashboardSidebar';
import { DashboardHeader } from '../../organisms/DashboardHeader/DashboardHeader';

interface DashboardTemplateProps {
  children: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 flex">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};