import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, Plus, Minus, Trash2, CreditCard, CheckCircle, Clock, MapPin, Phone, Filter } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button, Card, Badge } from '@/components/ui';
import { mockMenuItems } from '@/utils/mockData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  estimatedTime: number;
  dineInType: 'dine-in' | 'takeout';
  paymentMethod: 'visa' | 'mastercard' | 'amex' | 'debit';
  tableNumber?: number;
}

interface Table {
  id: number;
  capacity: number;
  available: boolean;
}

const CATEGORIES = ['Pizzas', 'Burgers', 'Steaks', 'Salads', 'Drinks', 'Breads', 'Desserts'];

// Initialize tables (12 tables total, most available)
const initializeTables = (): Table[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    capacity: i < 4 ? 2 : i < 8 ? 4 : 6, // 2-seater, 4-seater, 6-seater
    available: Math.random() > 0.3, // 70% available
  }));
};

const PAYMENT_METHODS = [
  { id: 'visa', name: 'Visa', emoji: '💳', color: 'blue' },
  { id: 'mastercard', name: 'Mastercard', emoji: '💳', color: 'red' },
  { id: 'amex', name: 'American Express', emoji: '💳', color: 'green' },
  { id: 'debit', name: 'Debit Card', emoji: '🏦', color: 'purple' },
];

export const CustomerDashboard: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Pizzas');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'visa' | 'mastercard' | 'amex' | 'debit'>('visa');
  const [dineInType, setDineInType] = useState<'dine-in' | 'takeout'>('dine-in');
  const [tables] = useState<Table[]>(initializeTables());
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const { logout, user } = useAuthStore();

  // Timer for order tracking
  useEffect(() => {
    if (!completedOrder) return;
    
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [completedOrder]);

  const filteredMenuItems = mockMenuItems.filter(item => item.category === selectedCategory);
  const getCartItemCount = (itemId: string) => cart.find(c => c.id === itemId)?.quantity || 0;

  const addToCart = (item: any) => {
    const existingItem = cart.find(c => c.id === item.id);
    if (existingItem) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const processPayment = () => {
    if (cart.length === 0) return;

    // Require table selection for dine-in orders
    if (dineInType === 'dine-in' && !selectedTable) {
      alert('🪑 Please select a table to continue');
      return;
    }

    const success = Math.random() > 0.05;
    
    if (success) {
      const orderNum = Math.floor(1000 + Math.random() * 9000).toString();
      const estimatedMinutes = 18 + Math.floor(Math.random() * 12);
      
      const newOrder: Order = {
        id: orderNum,
        items: [...cart],
        total: cartTotal + 5,
        timestamp: new Date(),
        estimatedTime: estimatedMinutes * 60,
        dineInType,
        paymentMethod: selectedPaymentMethod,
        tableNumber: dineInType === 'dine-in' && selectedTable ? selectedTable : undefined,
      };

      setCompletedOrder(newOrder);
      setRemainingTime(estimatedMinutes * 60);
      setCart([]);
    } else {
      alert('❌ Payment failed. Please try a different card.');
    }
  };

  const handleNewOrder = () => {
    setCompletedOrder(null);
    setRemainingTime(0);
  };

  // Order Tracking Page
  if (completedOrder) {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-elevation-1 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-lg flex items-center justify-center text-2xl">
                🍽️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Crescendo</h1>
                <p className="text-sm text-gray-600">Building Flavor to Perfection</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-white bg-danger-600 hover:bg-danger-700 rounded-lg transition font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed! ✅</h2>
            <p className="text-xl text-gray-600">We're {completedOrder.dineInType === 'dine-in' ? 'preparing your meal for dine-in' : 'preparing your order for takeout'}</p>
          </div>

          <Card className="mb-8 p-8 text-center bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
            <p className="text-gray-600 text-sm font-semibold mb-2">ORDER NUMBER</p>
            <p className="text-6xl font-bold text-primary-600 font-mono mb-2">{completedOrder.id}</p>
            <p className="text-lg text-gray-600">Save this number to track your order</p>
          </Card>

          <Card className="mb-8 p-8 bg-gradient-to-br from-accent-50 to-secondary-50 border-2 border-accent-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Clock className="text-accent-600" size={32} />
              <div>
                <p className="text-gray-600 text-sm font-semibold">ESTIMATED READY TIME</p>
                <p className="text-4xl font-bold text-accent-600 font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent-400 to-secondary-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(0, 100 - (remainingTime / (completedOrder.estimatedTime)) * 100)}%` }}
              ></div>
            </div>
          </Card>

          <Card className="mb-8 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Preparation Status</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Order Received</p>
                  <p className="text-sm text-gray-600">We received your order and started preparing</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Preparing Your Meal</p>
                  <p className="text-sm text-gray-600">Our chefs are carefully crafting your order</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Quality Check</p>
                  <p className="text-sm text-gray-600">Final inspection before delivery</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ready for Pickup</p>
                  <p className="text-sm text-gray-600">Pick up your fresh, hot order</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-8 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Your Order</h3>
            
            {completedOrder.dineInType === 'dine-in' && completedOrder.tableNumber && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">🪑 TABLE INFORMATION</p>
                <p className="text-2xl font-bold text-green-700">Table {completedOrder.tableNumber}</p>
                <p className="text-xs text-green-600 mt-1">Your meal will be served at this table</p>
              </div>
            )}

            <div className="space-y-3">
              {completedOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${(completedOrder.total - 5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">$5.00</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-primary-600">
                <span>Total</span>
                <span>${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Restaurant Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-primary-600" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">123 Food Street, Gourmet City, GC 12345</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary-600" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Contact</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleNewOrder}
            size="lg"
          >
            Place Another Order
          </Button>
        </div>
      </div>
    );
  }

  // Menu Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-elevation-1 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-lg flex items-center justify-center text-2xl">
              🍽️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crescendo</h1>
              <p className="text-sm text-gray-600">Building Flavor to Perfection</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-semibold text-gray-900">👋 {user?.name}</p>
              <p className="text-xs text-gray-500">Hungry today?</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-white bg-danger-600 hover:bg-danger-700 rounded-lg transition font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={20} className="text-gray-600 flex-shrink-0" />
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedCategory}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenuItems.map((item: any) => {
                const cartCount = getCartItemCount(item.id);
                return (
                  <Card key={item.id} className="hover:shadow-lg transition overflow-hidden flex flex-col relative">
                    {cartCount > 0 && (
                      <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        {cartCount}+
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 flex items-center gap-3">
                      <span className="text-5xl">{item.emoji || '🍔'}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                    </div>

                    <div className="p-4 flex-1">
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.spicy && <Badge variant="default">🌶️ Spicy</Badge>}
                        {item.vegan && <Badge variant="default">🌱 Vegan</Badge>}
                        {item.glutenFree && <Badge variant="default">🌾 GF</Badge>}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-bold text-primary-600 text-lg">${item.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Prep</p>
                          <p className="font-bold">{item.prepTime}m</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 border-t">
                      <Button 
                        variant="primary" 
                        className="w-full" 
                        size="sm"
                        onClick={() => addToCart(item)}
                      >
                        Add to Order
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Your Order
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🛒</div>
                  <p className="text-gray-600 text-sm">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded text-xs"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded text-xs"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-bold text-primary-600 text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4 space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span>${(cartTotal > 0 ? 5 : 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-primary-600 pt-2 border-t">
                      <span>Total</span>
                      <span>${(cartTotal + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Dine-in vs Takeout */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-2">ORDER TYPE</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDineInType('dine-in');
                        }}
                        className={`flex-1 py-2 rounded text-sm font-medium transition ${
                          dineInType === 'dine-in'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border border-blue-200'
                        }`}
                      >
                        🍽️ Dine-In
                      </button>
                      <button
                        onClick={() => {
                          setDineInType('takeout');
                          setSelectedTable(null);
                        }}
                        className={`flex-1 py-2 rounded text-sm font-medium transition ${
                          dineInType === 'takeout'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border border-blue-200'
                        }`}
                      >
                        📦 Takeout
                      </button>
                    </div>
                  </div>

                  {/* Table Selection for Dine-In */}
                  {dineInType === 'dine-in' && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-semibold text-green-900 mb-3">🪑 SELECT YOUR TABLE</p>
                      <div className="grid grid-cols-3 gap-2">
                        {tables.map(table => (
                          <button
                            key={table.id}
                            onClick={() => table.available && setSelectedTable(table.id)}
                            disabled={!table.available}
                            className={`p-3 rounded-lg text-sm font-medium transition border-2 ${
                              !table.available
                                ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-50'
                                : selectedTable === table.id
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-700 border-green-300 hover:border-green-500'
                            }`}
                          >
                            <div className="text-lg mb-1">{table.available ? '✅' : '❌'}</div>
                            <div>T{table.id}</div>
                            <div className="text-xs">{table.capacity}p</div>
                          </button>
                        ))}
                      </div>
                      {selectedTable && (
                        <p className="text-xs text-green-700 mt-3 font-medium">
                          ✓ Table {selectedTable} selected ({tables.find(t => t.id === selectedTable)?.capacity}-seater)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payment Methods */}
                  <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
                    <p className="text-xs font-semibold text-accent-900 mb-2">PAYMENT METHOD</p>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map(method => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id as any)}
                          className={`py-2 px-3 rounded text-sm font-medium transition border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-lg mb-1">{method.emoji}</div>
                          <div className="text-xs">{method.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={processPayment}
                    disabled={cart.length === 0}
                  >
                    <CreditCard size={18} />
                    Pay ${(cartTotal + 5).toFixed(2)}
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
