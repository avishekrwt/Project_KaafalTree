# KaafalTree - Server (Backend)

## 🔧 About the Backend

This is the Node.js/Express backend for the KaafalTree application. It provides REST API endpoints for [describe main backend functionality].

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- [Add any database requirements]

### Installation

```bash
cd server
npm install
```

### Environment Setup

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
[Add other environment variables]
```

### Start Development Server

```bash
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
src/
├── routes/             # API route definitions
├── controllers/        # Request handlers
├── models/            # Database models/schemas
├── middleware/        # Custom middleware
├── services/          # Business logic
├── utils/             # Helper functions
├── config/            # Configuration files
├── database/          # Database connection setup
├── validators/        # Input validation
└── server.js          # Entry point
```

## 🛠 Available Scripts

### `npm start`
Starts the development server with nodemon for auto-reload.

### `npm run build`
Compiles the application for production.

### `npm run dev`
Runs with verbose logging for development.

### `npm test`
Runs the test suite.

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Example Endpoints
```
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user by ID
POST   /api/users           - Create new user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
```

For complete API documentation, see [API_DOCS.md](./API_DOCS.md)

## 🗄 Database

### Connection
Database connection is configured in `src/config/database.js`

### Migrations
```bash
npm run migrate:up      # Run migrations
npm run migrate:down    # Rollback migrations
```

## 🔐 Authentication

This project uses JWT (JSON Web Tokens) for authentication.

- Token stored in HTTP-only cookies
- Token expiration: [Your duration]
- Refresh token mechanism: [Describe if applicable]

## 📦 Dependencies

- **express** - Web framework
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **bcryptjs** - Password hashing
- [Add other key dependencies]

## 🐛 Troubleshooting

### Port 5000 already in use
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database connection issues
- Verify DATABASE_URL in `.env`
- Check database service is running
- Verify credentials are correct

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## ⚠️ Security Notes

- Never commit `.env` files
- Always hash passwords
- Validate and sanitize user input
- Use HTTPS in production
- Implement rate limiting

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Follow code style guidelines
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📞 Support

For backend-specific issues, please open an issue with the `backend` label.

---

**Last Updated:** April 26, 2026