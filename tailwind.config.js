export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purvis: {
          bg: '#0d1117', surface: '#161b22', border: '#30363d',
          accent: '#58a6ff', green: '#3fb950', red: '#f85149',
          yellow: '#d29922', text: '#c9d1d9', muted: '#8b949e',
        }
      },
      fontFamily: { sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
