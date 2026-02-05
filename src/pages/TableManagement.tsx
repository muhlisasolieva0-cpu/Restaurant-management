import React, { useState } from 'react';
import { useRestaurantStore } from '@/store';
import { Card, Button, Badge, Input } from '@/components/ui';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { getStatusColor } from '@/utils/helpers';

export const TableManagement: React.FC = () => {
  const { tables, updateTableStatus, releaseTable } = useRestaurantStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const getTableColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 border-green-300 hover:shadow-elevation-2',
      occupied: 'bg-orange-100 border-orange-300 hover:shadow-elevation-2',
      reserved: 'bg-blue-100 border-blue-300 hover:shadow-elevation-2',
      dirty: 'bg-gray-100 border-gray-300 hover:shadow-elevation-2',
    };
    return colors[status] || colors.available;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      available: '✓',
      occupied: '👥',
      reserved: '📅',
      dirty: '🧹',
    };
    return icons[status] || '•';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600 mt-1">View and manage table status</p>
        </div>
        <div className="flex gap-2">
          <div className="text-right">
            <p className="text-sm text-gray-600">Occupancy: {tables.filter(t => t.status === 'occupied').length}/{tables.length}</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round((tables.filter(t => t.status === 'occupied').length / tables.length) * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['available', 'occupied', 'reserved', 'dirty'].map((status) => (
          <Card key={status} className="text-center">
            <p className="text-sm text-gray-600 capitalize">{status}</p>
            <p className="text-3xl font-bold text-gray-900">
              {tables.filter(t => t.status === status).length}
            </p>
          </Card>
        ))}
      </div>

      {/* Table Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Table Layout</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${getTableColor(table.status)} ${
                selectedTable === table.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{table.number}</p>
                <p className="text-xs text-gray-600 mt-1">{getStatusIcon(table.status)} {table.status}</p>
                <p className="text-xs text-gray-500 mt-2">👥 {table.capacity}</p>
                {table.currentOrderId && (
                  <p className="text-xs bg-white bg-opacity-50 rounded mt-2 px-2 py-1 text-gray-800">
                    Order {table.currentOrderId.slice(-4)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Table Details */}
      {selectedTable && (
        <Card
          title={`Table ${tables.find(t => t.id === selectedTable)?.number}`}
          elevated
        >
          {(() => {
            const table = tables.find(t => t.id === selectedTable);
            if (!table) return null;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={table.status === 'available' ? 'success' : table.status === 'occupied' ? 'warning' : 'info'}>
                      {table.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="text-lg font-bold text-gray-900">{table.capacity} guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-bold text-gray-900">{table.location}</p>
                  </div>
                  {table.reservedBy && (
                    <div>
                      <p className="text-sm text-gray-600">Reserved By</p>
                      <p className="text-lg font-bold text-gray-900">{table.reservedBy}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {table.status === 'occupied' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => releaseTable(table.id)}
                      className="flex-1"
                    >
                      Release Table
                    </Button>
                  )}
                  {table.status === 'available' && (
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                    >
                      Assign Order
                    </Button>
                  )}
                  {table.status === 'dirty' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateTableStatus(table.id, 'available')}
                      className="flex-1"
                    >
                      Mark Clean
                    </Button>
                  )}
                  {table.status === 'reserved' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Check In
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};
