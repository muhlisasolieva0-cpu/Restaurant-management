export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const calculateOrderTotal = (items: Array<{ price: number; quantity: number }>): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    served: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-orange-100 text-orange-800',
    reserved: 'bg-blue-100 text-blue-800',
    dirty: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    'on-break': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: '⏳',
    confirmed: '✓',
    preparing: '👨‍🍳',
    ready: '🍽️',
    served: '✅',
    cancelled: '❌',
    available: '✓',
    occupied: '👥',
    reserved: '📅',
    dirty: '🧹',
    active: '🟢',
    inactive: '⚫',
    'on-break': '⏸️',
  };
  return icons[status] || '•';
};
