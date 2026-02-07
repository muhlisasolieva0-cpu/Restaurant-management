import React, { useState } from 'react';
import {
  BarChart3,
  ClipboardList,
  Users,
  UtensilsCrossed,
  Package,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { OrderManagement } from '@/pages/OrderManagement';
import { TableManagement } from '@/pages/TableManagement';
import { StaffManagement } from '@/pages/StaffManagement';
import { InventoryManagement } from '@/pages/InventoryManagement';
import { CustomerDashboard } from '@/pages/CustomerDashboard';

type PageType = 'dashboard' | 'orders' | 'tables' | 'staff' | 'inventory';

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} />, color: 'text-blue-600' },
  { id: 'orders', label: 'Orders', icon: <ClipboardList size={20} />, color: 'text-green-600' },
  { id: 'tables', label: 'Tables', icon: <UtensilsCrossed size={20} />, color: 'text-orange-600' },
  { id: 'staff', label: 'Staff', icon: <Users size={20} />, color: 'text-purple-600' },
  { id: 'inventory', label: 'Inventory', icon: <Package size={20} />, color: 'text-red-600' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount] = useState(3);
  const { isAuthenticated, user, logout } = useAuthStore();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show customer dashboard for customers
  if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'tables':
        return <TableManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'inventory':
        return <InventoryManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-primary-900 text-white transition-all duration-300 flex flex-col shadow-elevation-3`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-primary-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-lg flex items-center justify-center font-bold text-lg">
              🍽️
            </div>
            {sidebarOpen && <span className="font-bold text-lg">Crescendo</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-6 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition mb-2 ${currentPage === item.id
                ? 'bg-secondary-600 text-white'
                : 'text-gray-300 hover:bg-primary-800'
                }`}
            >
              <span className={currentPage === item.id ? 'text-white' : item.color}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-primary-800 p-4">
          <div className="w-full p-2 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-full flex items-center justify-center font-bold text-sm text-white mb-2">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role} 👔</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="border-t border-primary-800 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition font-medium"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="border-t border-primary-800 p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-gray-800 rounded-lg transition text-gray-300"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-elevation-1">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {navItems.find(item => item.id === currentPage)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-danger-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings size={20} className="text-gray-600" />
            </button>

            {/* Logout Section */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role} 👔</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-white bg-danger-600 hover:bg-danger-700 rounded-lg transition font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}
