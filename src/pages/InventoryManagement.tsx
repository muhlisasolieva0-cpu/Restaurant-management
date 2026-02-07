import React, { useState } from 'react';
import { useRestaurantStore } from '@/store';
import { Card, Button, Badge } from '@/components/ui';
import { AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export const InventoryManagement: React.FC = () => {
  const { inventory, getLowStockItems } = useRestaurantStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const lowStockItems = getLowStockItems();

  const categories = ['all', ...new Set(inventory.map(item => item.category))];
  const filteredInventory = filterCategory === 'all'
    ? inventory
    : inventory.filter(item => item.category === filterCategory);

  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track stock levels and manage supplies</p>
        </div>
        <Button icon={Plus} variant="primary">
          Add Item
        </Button>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900">Low Stock Alert</h3>
              <p className="text-yellow-800 text-sm">{lowStockItems.length} items need restocking</p>
              <div className="mt-2 space-y-1">
                {lowStockItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-sm text-yellow-800">
                    • {item.name}: {item.quantity} {item.unit} (reorder at {item.reorderLevel})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">${totalInventoryValue.toFixed(2)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-3xl font-bold text-danger-600">{lowStockItems.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${filterCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <Card elevated>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Last Restocked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const isLowStock = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item.id} className={isLowStock ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.cost.toFixed(2)} per {item.unit}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{item.quantity} {item.unit}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.reorderLevel} {item.unit}</td>
                    <td className="px-6 py-4">
                      <Badge variant={isLowStock ? 'danger' : 'success'}>
                        {isLowStock ? '⚠️ Low Stock' : '✓ In Stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.lastRestocked)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit2 size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Trash2 size={16} className="text-danger-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
