# Restaurant Management System

An advanced, enterprise-grade restaurant management system built with React, TypeScript, and Tailwind CSS. Features a premium UI/UX with real-time order management, table tracking, staff management, inventory control, and comprehensive analytics.

## 🌟 Features

### Dashboard
- Real-time analytics and KPI tracking
- Revenue trends and order statistics
- Visual charts using Recharts
- Quick overview of restaurant operations

### Order Management
- Create and manage orders in real-time
- Track order status from pending to served
- Estimated preparation times
- Order filtering and search
- Payment tracking

### Table Management
- Visual table layout management
- Track table status (available, occupied, reserved, dirty)
- Occupancy rate monitoring
- Quick table assignments
- Reservation management

### Staff Management
- Organize staff by role (Manager, Chef, Waiter, Cashier, Delivery)
- Track staff status (Active, On Break, Inactive)
- Shift management
- Staff directory with contact information
- Quick break/resume functionality

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Inventory valuation
- Item categorization
- Reorder level management
- Last restocked tracking

## 🏗️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charting**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📦 Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Project Structure

```
src/
├── components/         # Reusable UI components
│   └── ui.tsx         # Core UI components library
├── pages/             # Page components
│   ├── Dashboard.tsx
│   ├── OrderManagement.tsx
│   ├── TableManagement.tsx
│   ├── StaffManagement.tsx
│   └── InventoryManagement.tsx
├── store/             # Zustand state management
│   └── index.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   ├── mockData.ts    # Mock data for development
│   └── helpers.ts     # Helper functions
├── App.tsx            # Main application component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🎨 Design System

The application features a premium design system with:
- Consistent color palette (Primary, Success, Danger, Warning)
- Elevation shadows for depth
- Responsive grid layouts
- Smooth transitions and hover effects
- Accessible component designs

## 💾 State Management

Using Zustand for lightweight, efficient state management:
- Order management (CRUD operations)
- Table status tracking
- Staff information and status
- Inventory management
- Reservation handling

## 🔄 Mock Data

The application comes with comprehensive mock data for:
- 8 menu items with nutritional info
- 8 restaurant tables
- 6 staff members
- 5 inventory items
- 3 active orders
- 2 reservations

Perfect for development and testing without a backend!

## 📱 Responsive Design

Fully responsive design that works seamlessly on:
- Desktop (1920px and above)
- Tablet (768px to 1024px)
- Mobile (320px to 767px)

## 🚀 Performance Optimizations

- Code splitting with Vite
- Lazy loading components
- Optimized chart rendering
- Efficient state updates
- CSS-in-JS optimizations

## 🔐 Features in Development

- Payment processing integration
- Real-time notifications
- Advanced reporting
- Multi-language support
- Role-based access control
- QR code menu ordering

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please contact the development team or create an issue on GitHub.

---

**Built with ❤️ for restaurant management excellence**
