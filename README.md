# Casandra's Client Keeper

A comprehensive client management system for pet grooming businesses, featuring a React Native mobile app and Node.js/Express backend API.

## 🎯 Project Overview

Casandra's Client Keeper helps pet grooming businesses manage their customers, pets, and appointments efficiently. The system includes customer profiles, dog records, appointment scheduling, and business analytics.

### Key Features

- 📱 **Mobile-First Design** - Native iOS and Android support via Expo
- 🔐 **Google OAuth Authentication** - Secure sign-in with JWT tokens
- 👥 **Customer Management** - Track customer information and contact details
- 🐕 **Dog Profiles** - Maintain detailed records for each pet
- 📅 **Appointment Scheduling** - Create and manage grooming appointments
- 📊 **Business Analytics** - Dashboard statistics and insights
- 🔍 **Search & Filter** - Quick search across customers, dogs, and appointments
- 📱 **Deep Linking** - Seamless OAuth redirect back to mobile app

## 🏗️ Architecture

```
casandras-client-keeper/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── swagger.yaml  # API documentation
│
└── frontend/         # React Native mobile app
    ├── app/          # Expo Router screens
    ├── components/   # Reusable UI components
    └── services/     # API service layer
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** (local or cloud instance)
- **Google OAuth Credentials** (for authentication)
- **Expo CLI** (for mobile development)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JKaulback/casandras-client-keeper.git
   cd casandras-client-keeper
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create and configure your .env file
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # Create and configure your .env file
   npx expo start
   ```

### Required Environment Variables

**Backend (.env):**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/casandras-client-keeper
JWT_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
MOBILE_REDIRECT_URI=casandras://auth/callback
FRONTEND_URL=http://localhost:8081
```

**Frontend (.env):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_REDIRECT_URI=casandras://auth/callback
```

## 📚 Documentation

### API Documentation
Once the backend is running, visit:
- **Swagger UI:** http://localhost:3000/api-docs
- **OpenAPI Spec:** [backend/swagger.yaml](backend/swagger.yaml)

### Additional Docs
- [Backend README](backend/README.md) - API setup and development
- [Frontend README](frontend/README.md) - Mobile app development
- [Deep Linking Setup](DEEP_LINKING_SETUP.md) - OAuth configuration
- [Render Deployment](backend/RENDER_DEPLOYMENT.md) - Production deployment guide

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express 5** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Passport.js** - Google OAuth authentication
- **JWT** - Token-based authentication
- **Swagger/OpenAPI** - API documentation
- **Winston** - Logging
- **Morgan** - HTTP request logging

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform and build tools
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence

## 🔑 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Initiate Google OAuth |
| `/api/users` | GET, POST | User management |
| `/api/customers` | GET, POST | Customer management |
| `/api/customers/search` | GET | Search customers |
| `/api/dogs` | GET, POST | Dog management |
| `/api/dogs/owner/:id` | GET | Get dogs by owner |
| `/api/appointments` | GET, POST | Appointment management |
| `/api/appointments/range` | GET | Get appointments by date |
| `/api/stats/dashboard` | GET | Dashboard statistics |

See [Swagger Documentation](http://localhost:3000/api-docs) for complete API reference.

## 📱 Running the Mobile App

### Development
```bash
cd frontend
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app

### Building for Production
```bash
# Android
npx expo run:android --variant release

# iOS
npx expo run:ios --configuration Release
```

## 🚢 Deployment

### Backend (Render.com)
See [RENDER_DEPLOYMENT.md](backend/RENDER_DEPLOYMENT.md) for detailed deployment instructions.

### Frontend
Build standalone apps using Expo EAS:
```bash
npx eas build --platform android
npx eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Justin Kaulback**
- GitHub: [@JKaulback](https://github.com/JKaulback)

## 🐛 Known Issues

- None currently

## 📋 Roadmap

- [ ] Recurring appointments
- [ ] Payment processing integration
- [ ] Email/SMS notifications
- [ ] Multi-user support with role-based access
- [ ] Calendar view for appointments
- [ ] Report generation

## 💡 Support

For issues and questions:
- Open an issue on GitHub
- Check the [API Documentation](http://localhost:3000/api-docs)
- Review the setup guides in `/backend` and `/frontend`
