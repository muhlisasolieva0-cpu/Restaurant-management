import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Button, Input } from '@/components/ui';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('Muxlisa');
  const [password, setPassword] = useState('Solieva123');
  const [userType, setUserType] = useState<'manager' | 'customer'>('manager');
  const { login, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'customer') {
      // Login as customer without credentials
      await login('customer', 'customer123');
    } else {
      // Login as manager with username/password
      await login(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-400 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative bg-white rounded-2xl shadow-elevation-4 w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-full flex items-center justify-center font-bold text-4xl mx-auto mb-4 shadow-elevation-2">
            🍽️
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crescendo</h1>
          <p className="text-gray-600">Building Flavor to Perfection</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6 space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">👤 Who are you?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType('manager')}
              className={`p-4 rounded-lg border-2 transition font-semibold ${
                userType === 'manager'
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
              }`}
            >
              👔 Manager
              <p className="text-xs text-gray-600 mt-1">Admin</p>
            </button>
            <button
              type="button"
              onClick={() => setUserType('customer')}
              className={`p-4 rounded-lg border-2 transition font-semibold ${
                userType === 'customer'
                  ? 'border-secondary-600 bg-secondary-50 text-secondary-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-secondary-300'
              }`}
            >
              🛵 Customer
              <p className="text-xs text-gray-600 mt-1">Order Food</p>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">Login Failed</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Manager Login Form */}
        {userType === 'manager' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="👤 Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoFocus
              required
            />

            <Input
              label="🔐 Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={LogIn}
              disabled={isLoading || !username.trim() || !password.trim()}
              loading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In as Manager'}
            </Button>
          </form>
        )}

        {/* Customer Login */}
        {userType === 'customer' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-center text-gray-600 mb-4">
              Ready to order? Login to browse our delicious menu!
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={LogIn}
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login as Customer'}
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          🔒 This is a demo. Data is stored locally.
        </p>
      </div>
    </div>
  );
};
