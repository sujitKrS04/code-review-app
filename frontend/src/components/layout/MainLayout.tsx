import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
