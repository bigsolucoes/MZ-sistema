
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex flex-1 pt-16"> {/* Adjust pt-16 based on Header height */}
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto mb-10"> {/* mb-10 for footer space */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
    