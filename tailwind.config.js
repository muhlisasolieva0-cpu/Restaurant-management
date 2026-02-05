/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf3f2',
          100: '#fce7e4',
          200: '#f8cac5',
          300: '#f4ada6',
          400: '#ed7066',
          500: '#e85d52',
          600: '#d64732',
          700: '#b83d2a',
          800: '#933226',
          900: '#7a2920',
        },
        secondary: {
          50: '#fef9f3',
          100: '#fdf1e7',
          200: '#fbddc9',
          300: '#f8c9ab',
          400: '#f4a170',
          500: '#f08f4a',
          600: '#e0752f',
          700: '#c45f27',
          800: '#a04d22',
          900: '#84401d',
        },
        accent: {
          50: '#fffcf5',
          100: '#fffaf0',
          200: '#fff4e0',
          300: '#ffecc9',
          400: '#ffdd99',
          500: '#ffd966',
          600: '#f0c94d',
          700: '#d4a837',
          800: '#b08a2a',
          900: '#947022',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#eab308',
          600: '#ca8a04',
        },
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.15)',
        'elevation-4': '0 15px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}

