# KaafalTree - Project Overview

## 🌳 About the Project

KaafalTree is a full-stack web application designed to [insert your project's main purpose]. This repository serves as the central hub for both frontend and backend components of the application.

## 📋 Project Structure

```
KaafalTree/
├── client/              # Frontend React + Vite application
├── server/              # Backend Node.js/Express server
├── docs/                # Documentation
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KaafalTree
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

#### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000 (or your configured port)
```

**Terminal 2 - Start Frontend Development Server:**
```bash
cd client
npm run dev
# Application runs on http://localhost:5173 (Vite default)
```

#### Production Mode
```bash
# Backend
cd server
npm run build
npm run start:prod

# Frontend
cd client
npm run build
```

## 📁 Project Components

- **Client (Frontend)** - React + Vite user interface
- **Server (Backend)** - Node.js/Express REST API

For detailed information, see respective README files:
- [Frontend Documentation](./client/README.md)
- [Backend Documentation](./server/README.md)

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- [Add your frontend tools]

### Backend
- Node.js
- Express.js
- [Add your backend tools]

## 📝 Available Scripts

### Backend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Create a new branch for your feature
2. Commit your changes
3. Push to the branch
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👤 Author

**Abhishek** - [(https://github.com/avishekrwt)]

## ❓ Questions & Support

For questions or support, please open an issue on GitHub.

---

**Last Updated:** April 26, 2026
