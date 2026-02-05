export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'online' | 'crypto';
export type DineInType = 'dine-in' | 'takeaway' | 'delivery';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  prepTime: number;
  image?: string;
  emoji?: string;
  available: boolean;
  spicy: boolean;
  vegan: boolean;
  glutenFree: boolean;
  calories?: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready';
}

export interface Order {
  id: string;
  tableId?: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  dineInType: DineInType;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
  preparationStartedAt?: Date;
  completedAt?: Date;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'dirty';
  currentOrderId?: string;
  reservedBy?: string;
  reservedUntil?: Date;
  location: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'manager' | 'chef' | 'waiter' | 'cashier' | 'delivery';
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on-break';
  joinDate: Date;
  shift?: 'morning' | 'afternoon' | 'evening';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  cost: number;
  supplier?: string;
  lastRestocked: Date;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  peakHours: number[];
  topItems: string[];
  customerSatisfaction: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  numberOfGuests: number;
  reservedDate: Date;
  reservedTime: string;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}
