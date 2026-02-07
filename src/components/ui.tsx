import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className = '',
  elevated = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-6 ${
        elevated ? 'shadow-elevation-3' : 'shadow-elevation-1'
      } transition-shadow hover:shadow-elevation-2 ${className}`}
    >
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-success-50 text-success-600',
    danger: 'bg-danger-50 text-danger-600',
    warning: 'bg-warning-50 text-warning-600',
    info: 'bg-primary-50 text-primary-600',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-block rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-danger-600 text-white hover:bg-danger-700',
    success: 'bg-success-600 text-white hover:bg-success-700',
    warning: 'bg-warning-600 text-white hover:bg-warning-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="animate-spin">⏳</span> : Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 text-gray-400" size={18} />}
        <input
          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-danger-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition ${
          error ? 'border-danger-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-elevation-4 max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-gray-200 flex gap-2 justify-end">{footer}</div>}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'success' | 'danger' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
}) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-success-600 bg-success-50',
    danger: 'text-danger-600 bg-danger-50',
    warning: 'text-warning-600 bg-warning-50',
  };

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        {trend && (
          <p className={`text-sm font-medium ${trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-gray-600'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue || '0%'}
          </p>
        )}
      </div>
      {Icon && <div className={`p-3 rounded-lg ${colors[color]}`}><Icon size={24} /></div>}
    </Card>
  );
};

interface TableProps {
  headers: string[];
  rows: Array<Record<string, any>>;
  onRowClick?: (row: any) => void;
  loading?: boolean;
}

export const Table: React.FC<TableProps> = ({ headers, rows, onRowClick, loading = false }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 text-sm text-gray-900">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
