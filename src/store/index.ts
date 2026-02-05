import { create } from 'zustand';
import { Order, OrderStatus, Table, MenuItem, Staff, InventoryItem, Reservation } from '@/types/index';
import { mockMenuItems, mockTables, mockStaff, mockInventory, mockOrders, mockReservations } from '@/utils/mockData';

interface RestaurantStore {
  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  
  // Tables
  tables: Table[];
  getTableStatus: (tableId: string) => Table | undefined;
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  assignOrderToTable: (tableId: string, orderId: string) => void;
  releaseTable: (tableId: string) => void;
  
  // Menu
  menuItems: MenuItem[];
  getMenuByCategory: (category: string) => MenuItem[];
  updateMenuItemAvailability: (itemId: string, available: boolean) => void;
  
  // Staff
  staff: Staff[];
  updateStaffStatus: (staffId: string, status: Staff['status']) => void;
  
  // Inventory
  inventory: InventoryItem[];
  updateInventoryQuantity: (itemId: string, quantity: number) => void;
  getLowStockItems: () => InventoryItem[];
  
  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  orders: mockOrders,
  selectedOrder: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map((order) => order.id === id ? { ...order, ...updates, updatedAt: new Date() } : order),
  })),
  getOrdersByStatus: (status) => get().orders.filter((order) => order.status === status),
  
  tables: mockTables,
  getTableStatus: (tableId) => get().tables.find((table) => table.id === tableId),
  updateTableStatus: (tableId, status) => set((state) => ({
    tables: state.tables.map((table) => table.id === tableId ? { ...table, status } : table),
  })),
  assignOrderToTable: (tableId, orderId) => set((state) => ({
    tables: state.tables.map((table) => table.id === tableId ? { ...table, currentOrderId: orderId, status: 'occupied' } : table),
  })),
  releaseTable: (tableId) => set((state) => ({
    tables: state.tables.map((table) => table.id === tableId ? { ...table, currentOrderId: undefined, status: 'dirty' } : table),
  })),
  
  menuItems: mockMenuItems,
  getMenuByCategory: (category) => get().menuItems.filter((item) => item.category === category),
  updateMenuItemAvailability: (itemId, available) => set((state) => ({
    menuItems: state.menuItems.map((item) => item.id === itemId ? { ...item, available } : item),
  })),
  
  staff: mockStaff,
  updateStaffStatus: (staffId, status) => set((state) => ({
    staff: state.staff.map((member) => member.id === staffId ? { ...member, status } : member),
  })),
  
  inventory: mockInventory,
  updateInventoryQuantity: (itemId, quantity) => set((state) => ({
    inventory: state.inventory.map((item) => item.id === itemId ? { ...item, quantity } : item),
  })),
  getLowStockItems: () => get().inventory.filter((item) => item.quantity <= item.reorderLevel),
  
  reservations: mockReservations,
  addReservation: (reservation) => set((state) => ({ reservations: [...state.reservations, reservation] })),
  updateReservationStatus: (reservationId, status) => set((state) => ({
    reservations: state.reservations.map((res) => res.id === reservationId ? { ...res, status } : res),
  })),
}));
