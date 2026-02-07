import React from 'react';
import { useRestaurantStore } from '@/store';
import { Card, StatCard, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/helpers';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { orders, tables, staff } = useRestaurantStore();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const completedOrders = orders.filter(o => o.status === 'served').length;
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const activeStaff = staff.filter(s => s.status === 'active').length;

  const orderTrendData = [
    { time: '10:00 AM', orders: 4, revenue: 120 },
    { time: '12:00 PM', orders: 12, revenue: 380 },
    { time: '2:00 PM', orders: 8, revenue: 260 },
    { time: '4:00 PM', orders: 6, revenue: 180 },
    { time: '6:00 PM', orders: 15, revenue: 520 },
    { time: '8:00 PM', orders: 18, revenue: 680 },
  ];

  const orderStatusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#eab308' },
    { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: '#f97316' },
    { name: 'Ready', value: orders.filter(o => o.status === 'ready').length, color: '#22c55e' },
    { name: 'Served', value: orders.filter(o => o.status === 'served').length, color: '#10b981' },
  ];

  const paymentMethodData = [
    { name: 'Card', value: 45, color: '#0ea5e9' },
    { name: 'Cash', value: 35, color: '#6366f1' },
    { name: 'Online', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#ec4899' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your restaurant overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="success"
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          label="Active Orders"
          value={activeOrders}
          icon={Clock}
          color="primary"
          trend="neutral"
          trendValue={`${completedOrders} completed`}
        />
        <StatCard
          label="Table Occupancy"
          value={`${occupiedTables}/${tables.length}`}
          icon={Users}
          color="warning"
          trend="up"
          trendValue={`${Math.round((occupiedTables / tables.length) * 100)}%`}
        />
        <StatCard
          label="Active Staff"
          value={activeStaff}
          icon={Users}
          color="primary"
          trend="neutral"
          trendValue={`${staff.filter(s => s.status === 'on-break').length} on break`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Trend */}
        <Card title="Order Trends" className="lg:col-span-2" elevated>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#0ea5e9" />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status Distribution */}
        <Card title="Order Status" elevated>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue by Hour" elevated>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Payment Methods" elevated>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card title="📋 Recent Orders" elevated>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition">
              <div>
                <p className="font-bold text-gray-900 text-lg">{order.customerName}</p>
                <p className="text-sm text-gray-600 mt-1">📦 {order.items.length} items • 💰 {formatCurrency(order.totalAmount)}</p>
              </div>
              <Badge variant={order.status === 'served' ? 'success' : order.status === 'preparing' ? 'warning' : 'info'}>
                {order.status === 'pending' && '⏳'} {order.status === 'preparing' && '👨‍🍳'} {order.status === 'ready' && '🟢'} {order.status === 'served' && '✅'} {order.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
