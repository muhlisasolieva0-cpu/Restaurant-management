import React, { useState } from 'react';
import { useRestaurantStore } from '@/store';
import { Card, Button, Badge, Input, Modal } from '@/components/ui';
import { formatCurrency } from '@/utils/helpers';
import { Plus, X, ShoppingCart } from 'lucide-react';
import { Order } from '@/types/index';

export const OrderManagement: React.FC = () => {
  const { orders, menuItems, addOrder } = useRestaurantStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newOrderData, setNewOrderData] = useState({
    customerName: '',
    dineInType: 'dine-in' as const,
    items: [] as Array<{ menuItemId: string; quantity: number }>,
  });

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const getEstimatedTime = (order: Order) => {
    if (order.preparationStartedAt) {
      const elapsed = (new Date().getTime() - order.preparationStartedAt.getTime()) / 60000;
      const maxTime = Math.max(...order.items.map(item => {
        const menuItem = menuItems.find(m => m.id === item.menuItemId);
        return menuItem?.prepTime || 0;
      }));
      return Math.max(0, Math.ceil(maxTime - elapsed));
    }
    return Math.max(...order.items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return menuItem?.prepTime || 0;
    }));
  };

  const getFoodEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Main Course': '🍽️',
      'Appetizer': '🥗',
      'Dessert': '🍰',
      'Beverage': '🥤',
      'Soup': '🍲',
    };
    return emojis[category] || '🍽️';
  };

  const addItemToOrder = (menuItemId: string) => {
    const existing = newOrderData.items.find(item => item.menuItemId === menuItemId);
    if (existing) {
      setNewOrderData({
        ...newOrderData,
        items: newOrderData.items.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      setNewOrderData({
        ...newOrderData,
        items: [...newOrderData.items, { menuItemId, quantity: 1 }],
      });
    }
  };

  const removeItemFromOrder = (menuItemId: string) => {
    setNewOrderData({
      ...newOrderData,
      items: newOrderData.items.filter(item => item.menuItemId !== menuItemId),
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(menuItemId);
      return;
    }
    setNewOrderData({
      ...newOrderData,
      items: newOrderData.items.map(item =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      ),
    });
  };

  const calculateOrderTotal = () => {
    return newOrderData.items.reduce((total, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  const createOrder = () => {
    if (!newOrderData.customerName.trim() || newOrderData.items.length === 0) {
      alert('Please enter customer name and select items');
      return;
    }

    const order: Order = {
      id: `O${Date.now()}`,
      customerName: newOrderData.customerName,
      items: newOrderData.items.map((item, idx) => ({
        id: `OI${Date.now()}-${idx}`,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        status: 'pending',
      })),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      dineInType: newOrderData.dineInType,
      totalAmount: calculateOrderTotal(),
      paymentStatus: 'pending',
    };

    addOrder(order);
    setNewOrderData({ customerName: '', dineInType: 'dine-in', items: [] });
    setShowNewOrderModal(false);
    setShowMenuModal(false);
    alert('Order created successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Create and manage orders with ease</p>
        </div>
        <Button onClick={() => setShowNewOrderModal(true)} icon={Plus} variant="primary" size="lg">
          New Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'served'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${filterStatus === status
                ? 'bg-primary-600 text-white shadow-elevation-2'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className={`cursor-pointer transition transform hover:scale-105 ${selectedOrder === order.id ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            onClick={() => setSelectedOrder(order.id)}
            elevated
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{order.customerName}</h3>
                  <p className="text-sm text-gray-600">#{order.id.slice(-6)}</p>
                </div>
                <Badge variant={order.status === 'served' ? 'success' : order.status === 'ready' ? 'success' : order.status === 'preparing' ? 'warning' : 'info'}>
                  {order.status === 'pending' && '⏳'} {order.status === 'preparing' && '👨‍🍳'} {order.status === 'ready' && '🟢'} {order.status === 'served' && '✅'} {order.status}
                </Badge>
              </div>

              {/* Items with emojis */}
              <div className="space-y-2">
                {order.items.map((item) => {
                  const menuItem = menuItems.find(m => m.id === item.menuItemId);
                  return (
                    <div key={item.id} className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{menuItem?.name}</p>
                        <p className="text-xs text-gray-600">{formatCurrency(menuItem?.price || 0)} each</p>
                      </div>
                      <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Prep Time</p>
                  <p className="font-bold text-blue-600 text-lg">⏱️ {getEstimatedTime(order)}m</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="font-bold text-green-600 text-lg">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>

              {/* Time */}
              <p className="text-xs text-gray-500 text-center">
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* New Order Modal - Step 1: Customer Info */}
      <Modal
        isOpen={showNewOrderModal && !showMenuModal}
        onClose={() => setShowNewOrderModal(false)}
        title="Create New Order"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewOrderModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowMenuModal(true)}
              disabled={!newOrderData.customerName.trim()}
            >
              Next: Select Items
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="👤 Customer Name"
            placeholder="Enter customer name..."
            value={newOrderData.customerName}
            onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">📦 Order Type</label>
            <div className="space-y-2">
              {[
                { value: 'dine-in', label: '🍽️ Dine In', desc: 'Customer eats at restaurant' },
                { value: 'takeaway', label: '📦 Takeaway', desc: 'Customer picks up order' },
                { value: 'delivery', label: '🚗 Delivery', desc: 'Deliver to customer' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setNewOrderData({ ...newOrderData, dineInType: option.value as any })}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${newOrderData.dineInType === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* New Order Modal - Step 2: Select Items */}
      <Modal
        isOpen={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        title="🍽️ Select Items"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowMenuModal(false)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={createOrder}
              disabled={newOrderData.items.length === 0}
            >
              Create Order ({formatCurrency(calculateOrderTotal())})
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Menu Grid */}
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {menuItems.map((item) => {
              const isInOrder = newOrderData.items.find(i => i.menuItemId === item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${isInOrder
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">{getFoodEmoji(item.category)}</span>
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.spicy && <Badge variant="danger" size="sm">🌶️ Spicy</Badge>}
                        {item.vegan && <Badge variant="success" size="sm">🌱 Vegan</Badge>}
                        {item.glutenFree && <Badge variant="info" size="sm">🌾 Gluten Free</Badge>}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-primary-600">{formatCurrency(item.price)}</p>
                      <p className="text-xs text-gray-600">⏱️ {item.prepTime}m</p>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  {isInOrder ? (
                    <div className="flex items-center gap-2 mt-3 bg-white rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item.id, isInOrder.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-bold text-lg">{isInOrder.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, isInOrder.quantity + 1)}
                        className="px-2 py-1 bg-primary-600 text-white hover:bg-primary-700 rounded font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItemFromOrder(item.id)}
                        className="px-2 py-1 bg-danger-600 text-white hover:bg-danger-700 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItemToOrder(item.id)}
                      className="w-full mt-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add to Order
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          {newOrderData.items.length > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg border-2 border-primary-200">
              <p className="text-sm text-gray-600 mb-2">Order Summary</p>
              <div className="space-y-1 mb-3">
                {newOrderData.items.map((item) => {
                  const menuItem = menuItems.find(m => m.id === item.menuItemId);
                  return (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <span>{item.quantity}x {menuItem?.name}</span>
                      <span className="font-semibold">{formatCurrency((menuItem?.price || 0) * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t-2 border-primary-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">{formatCurrency(calculateOrderTotal())}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-b from-blue-50 to-white rounded-lg">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-xl font-semibold">No orders yet</p>
          <p className="text-gray-500 mt-2">Click "New Order" to start taking orders</p>
        </div>
      )}
    </div>
  );
};
