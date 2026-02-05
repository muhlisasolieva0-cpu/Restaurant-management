# Quick Start Guide

## 🚀 Getting Started with RestauPro

### Step 1: Install Node.js

Before running this project, you need to install Node.js and npm.

**On macOS:**
```bash
# If you have Homebrew installed
brew install node

# Or download from https://nodejs.org/ (recommended)
```

**Verify installation:**
```bash
node --version
npm --version
```

### Step 2: Install Dependencies

Once Node.js is installed, open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React 18
- TypeScript
- Tailwind CSS
- Recharts for analytics
- Zustand for state management
- And more...

### Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 📋 Default Login

The application currently uses mock data. You can log in with:
- **Username**: Any name (currently not enforced)
- **Password**: Not required for this version

## 🎯 Key Features to Explore

1. **Dashboard**: Click the dashboard icon to see real-time analytics
2. **Orders**: Manage customer orders with real-time status tracking
3. **Tables**: Visual table management with occupancy tracking
4. **Staff**: Manage team members and shifts
5. **Inventory**: Track stock levels and manage supplies

## 💡 Tips

- The sidebar can be collapsed/expanded with the toggle button
- Click on any item to view detailed information
- Use the filters to narrow down results
- All data is mock data stored in memory (resets on refresh)

## 🛠️ Development

The project structure is organized as follows:

- `src/components/` - Reusable UI components
- `src/pages/` - Page components for each feature
- `src/store/` - State management with Zustand
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions and mock data

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## ⚠️ Next Steps for Production

To make this production-ready:

1. **Connect to Backend API**
   - Replace mock data with real API calls
   - Implement authentication/authorization
   - Add database integration

2. **Add Missing Features**
   - User authentication
   - Payment processing
   - Real-time notifications
   - Report generation

3. **Performance Optimization**
   - Implement pagination for large datasets
   - Add caching strategies
   - Optimize images and assets

4. **Security**
   - Add CSRF protection
   - Implement proper error handling
   - Secure sensitive data

## 🐛 Troubleshooting

### Node.js not found
Make sure Node.js is properly installed and added to your PATH. Restart your terminal after installation.

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Package installation fails
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

## 📞 Support

For questions or issues, refer to the main README.md file or check the official documentation for any package used.

Happy coding! 🍽️
