/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: 'oklch(0.58 0.19 258)', dark: 'oklch(0.50 0.19 258)', darker: 'oklch(0.42 0.17 258)' },
        navy:  { DEFAULT: 'oklch(0.21 0.07 262)', light: 'oklch(0.28 0.09 262)' },
        gold:  '#FFC107',
        surface: 'oklch(0.985 0.004 250)',
        card:    '#ffffff',
      },
      fontFamily: {
        heading: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        body:    ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px', md: '12px', lg: '20px', pill: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(43,43,45,.14)',
        md: '0 3px 10px rgba(43,43,45,.16)',
        lg: '0 12px 32px rgba(43,43,45,.22)',
      },
    },
  },
  plugins: [],
}
