import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'chef' | 'waiter' | 'cashier' | 'customer';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Hardcoded credentials (in production, this would be from a backend API)
const MANAGER_CREDENTIALS = {
  username: 'Muxlisa',
  password: 'Solieva123',
};

const CUSTOMER_CREDENTIALS = {
  username: 'customer',
  password: 'customer123',
};

const MANAGER_USER: User = {
  id: 'USR001',
  name: 'Muxlisa',
  email: 'muxlisa@restaurant.com',
  role: 'manager',
};

const CUSTOMER_USER: User = {
  id: 'USR002',
  name: 'Customer',
  email: 'customer@restaurant.com',
  role: 'customer',
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (
      username === MANAGER_CREDENTIALS.username &&
      password === MANAGER_CREDENTIALS.password
    ) {
      set({
        user: MANAGER_USER,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else if (
      username === CUSTOMER_CREDENTIALS.username &&
      password === CUSTOMER_CREDENTIALS.password
    ) {
      set({
        user: CUSTOMER_USER,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Invalid username or password',
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
