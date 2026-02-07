import React, { useState } from 'react';
import { useRestaurantStore } from '@/store';
import { Card, Button, Badge } from '@/components/ui';
import { Plus, Edit2 } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export const StaffManagement: React.FC = () => {
  const { staff, updateStaffStatus } = useRestaurantStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);



  const byRole = staff.reduce((acc, member) => {
    if (!acc[member.role]) acc[member.role] = [];
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, typeof staff>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage team members and shifts</p>
        </div>
        <Button icon={Plus} variant="primary">
          Add Staff Member
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600">Total Staff</p>
          <p className="text-3xl font-bold text-gray-900">{staff.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-green-600">{staff.filter(s => s.status === 'active').length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">On Break</p>
          <p className="text-3xl font-bold text-yellow-600">{staff.filter(s => s.status === 'on-break').length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-3xl font-bold text-gray-600">{staff.filter(s => s.status === 'inactive').length}</p>
        </Card>
      </div>

      {/* Staff by Role */}
      <div className="space-y-6">
        {Object.entries(byRole).map(([role, members]) => (
          <Card key={role} title={role.charAt(0).toUpperCase() + role.slice(1)} elevated>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedStaff(member.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-elevation-2 ${selectedStaff === member.id ? 'ring-2 ring-primary-500 border-primary-500' : 'border-gray-200'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <Badge variant={member.status === 'active' ? 'success' : member.status === 'on-break' ? 'warning' : 'info'}>
                      {member.status === 'active' ? '🟢' : member.status === 'on-break' ? '⏸️' : '⚫'} {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{member.phone}</p>
                  {member.shift && (
                    <p className="text-sm text-gray-600 mb-3">Shift: {member.shift}</p>
                  )}
                  <p className="text-xs text-gray-500">Joined {formatDate(member.joinDate)}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Staff Details */}
      {selectedStaff && (
        <Card
          title={staff.find(s => s.id === selectedStaff)?.name}
          elevated
        >
          {(() => {
            const member = staff.find(s => s.id === selectedStaff);
            if (!member) return null;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <Badge variant="info">
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={member.status === 'active' ? 'success' : member.status === 'on-break' ? 'warning' : 'info'}>
                      {member.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{member.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(member.joinDate)}</p>
                  </div>
                  {member.shift && (
                    <div>
                      <p className="text-sm text-gray-600">Shift</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{member.shift}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  {member.status !== 'on-break' && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => updateStaffStatus(member.id, 'on-break')}
                      className="flex-1"
                    >
                      Break
                    </Button>
                  )}
                  {member.status === 'on-break' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => updateStaffStatus(member.id, 'active')}
                      className="flex-1"
                    >
                      Resume
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
