# KaafalTree - Client (Frontend)

## 🎨 About the Frontend

This is the React + Vite frontend for the KaafalTree application. It provides a user-friendly interface for [describe main user interactions]. Built with modern tooling for fast development and optimal performance.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
├── pages/              # Page components
├── services/           # API services & utilities
├── hooks/              # Custom React hooks
├── context/            # React Context for state management
├── styles/             # CSS/SCSS files
├── utils/              # Helper functions
├── App.jsx             # Main App component
└── main.jsx            # Entry point
```

## 🛠 Available Scripts

### `npm run dev`
Runs the app in development mode with HMR for instant updates.

### `npm run build`
Builds the app for production to the `dist` folder using Vite's optimized bundling.

### `npm run preview`
Previews the production build locally before deployment.

### `npm run lint`
Runs ESLint to check code quality and style.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=5000
```

### Vite Config
See `vite.config.js` for build and dev server configuration.

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- [Add other key dependencies]

## 🎯 Key Features

- ⚡ Lightning-fast HMR with Vite
- ⚛️ Modern React with hooks
- 🎨 Responsive design
- 🔄 Real-time updates
- [Add other features]

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### HMR not working
- Ensure `vite.config.js` has HMR configured correctly
- Try clearing browser cache
- Restart the dev server

## 📝 Component Guidelines

- Keep components small and focused
- Use functional components with hooks
- Maintain prop documentation
- Use meaningful component names
- Leverage Vite's fast refresh for quick iteration

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code style
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For frontend-specific issues, please open an issue with the `frontend` label.

---

**Last Updated:** April 26, 2026