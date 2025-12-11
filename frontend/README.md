# Frontend Mobile App - Casandra's Client Keeper

React Native mobile application for managing pet grooming business clients, dogs, and appointments.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Backend API running (see [backend README](../backend/README.md))

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_REDIRECT_URI=casandras://auth/callback
```

**Note:** For physical device testing, replace `localhost` with your computer's IP address:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
```

### Running the App

Start the development server:

```bash
npx expo start
```

Then choose your platform:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator  
- Press `w` to open in web browser
- Scan QR code with Expo Go app for physical device

## 📱 Features

### Authentication
- 🔐 Google OAuth sign-in with deep linking
- 🔄 Automatic token refresh
- 🚪 Secure sign-out

### Customer Management
- 📋 View all customers
- 🔍 Search customers by name, phone, or email
- ➕ Add new customers
- ✏️ Edit customer details
- 📱 Contact customers directly
- 🐕 View customer's dogs

### Dog Management
- 📋 View all dogs
- 🔍 Search dogs by name or breed
- ➕ Add new dogs with detailed profiles
- ✏️ Edit dog information
- 🏷️ Track breed, weight, age, temperament
- 📝 Special notes for grooming

### Appointment Management
- 📅 View all appointments
- 📆 Calendar view (monthly/daily)
- ➕ Schedule new appointments
- ✏️ Edit appointment details
- ❌ Cancel appointments
- 🔔 Status tracking (pending/confirmed/completed/cancelled)
- 💰 Payment status tracking

### Dashboard
- 📊 Business statistics
- 👥 Total customers count
- 🐕 Total dogs count
- 📅 Today's appointments
- 📈 Upcoming appointments

## 🗂️ Project Structure

```
frontend/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (auth)/                # Authentication screens
│   │   ├── sign-in.tsx       # Google OAuth sign-in
│   │   └── callback.tsx      # OAuth callback handler
│   ├── (main)/               # Main app screens
│   │   ├── appointments/     # Appointment screens
│   │   ├── customers/        # Customer screens
│   │   └── dogs/             # Dog screens
│   ├── (future)/             # Planned features
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Dashboard/home
│   └── settings.tsx          # Settings screen
├── components/               # Reusable UI components
│   ├── AppointmentComponents.tsx
│   ├── DashboardComponents.tsx
│   ├── DetailComponents.tsx
│   ├── FormComponents.tsx
│   ├── ListComponents.tsx
│   └── StateComponents.tsx
├── services/                 # API service layer
│   ├── api.ts                # Axios configuration
│   ├── authService.ts        # Authentication API
│   ├── customerService.ts    # Customer API
│   ├── dogService.ts         # Dog API
│   ├── appointmentService.ts # Appointment API
│   └── statsService.ts       # Statistics API
├── styles/
│   └── theme.ts              # Theme configuration
├── assets/                   # Images and static files
├── app.json                  # Expo configuration
└── package.json
```

## 🎨 UI Components

### Reusable Components
- **FormField** - Text input with label and error handling
- **SelectField** - Dropdown picker component
- **DateTimeField** - Date/time picker
- **SimpleDatePicker** - Calendar date picker
- **MonthCalendarModal** - Monthly calendar view
- **MultiSelectTemperament** - Multiple selection for dog temperament

### Screen-Specific Components
- **AppointmentComponents** - Appointment cards and lists
- **DashboardComponents** - Dashboard stats and widgets
- **DetailComponents** - Detail view layouts
- **ListComponents** - List views with search
- **StateComponents** - Loading and error states

## 🔐 Authentication Flow

See [DEEP_LINKING_SETUP.md](../DEEP_LINKING_SETUP.md) for detailed OAuth configuration.

### How It Works

1. User taps "Sign in with Google"
2. App opens browser with backend OAuth URL
3. User authenticates with Google
4. Backend creates JWT and redirects to `casandras://auth/callback`
5. Deep link opens app and navigates to callback screen
6. Token verified and stored in AsyncStorage
7. User redirected to dashboard

### Deep Link Configuration

The app is configured with the custom scheme `casandras://` for OAuth redirects:

**app.json:**
```json
{
  "scheme": "casandras",
  "extra": {
    "redirectUri": "casandras://auth/callback"
  }
}
```

## 📡 API Integration

All API calls are handled through service modules in `services/`:

### Example Usage

```typescript
import { customerService } from '@/services/customerService';

// Get all customers
const customers = await customerService.getCustomers();

// Search customers
const results = await customerService.searchCustomers('John');

// Create customer
const newCustomer = await customerService.createCustomer({
  name: 'John Doe',
  phone: '555-1234',
  email: 'john@example.com'
});
```

### API Service Features
- Automatic token injection
- Request/response interceptors
- Error handling
- Token refresh on 401 responses

## 🧭 Navigation

The app uses [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing:

### Route Structure
- `/` - Dashboard (requires auth)
- `/(auth)/sign-in` - Sign in screen
- `/(auth)/callback` - OAuth callback handler
- `/(main)/customers` - Customer list
- `/(main)/customers/new` - Add customer
- `/(main)/customers/[id]` - Customer details
- `/(main)/dogs` - Dog list
- `/(main)/dogs/new` - Add dog
- `/(main)/dogs/[id]` - Dog details
- `/(main)/appointments` - Appointment list
- `/(main)/appointments/new` - Schedule appointment
- `/(main)/appointments/[id]` - Appointment details
- `/settings` - App settings

## 🛠️ Development

### Run in Development

```bash
npm start
```

### Build for Development

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

### Linting

```bash
npm run lint
```

### Clear Cache

If you encounter issues:
```bash
npx expo start --clear
```

## 📱 Testing on Devices

### iOS (Physical Device)
1. Install Expo Go from App Store
2. Ensure device and computer are on same WiFi
3. Scan QR code from terminal

### Android (Physical Device)
1. Install Expo Go from Google Play
2. Enable Developer Mode
3. Scan QR code from terminal

### Emulators
- **Android:** Android Studio required
- **iOS:** Xcode required (macOS only)

## 🚀 Building for Production

### Using Expo EAS Build

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure project:**
   ```bash
   eas build:configure
   ```

3. **Build for Android:**
   ```bash
   eas build --platform android
   ```

4. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

### Environment Variables for Production

Update your environment variables for production deployment:
```env
EXPO_PUBLIC_API_URL=https://your-production-api.com
EXPO_PUBLIC_REDIRECT_URI=casandras://auth/callback
```

## 📦 Key Dependencies

### Core
- **expo** - Expo development platform
- **expo-router** - File-based navigation
- **react-native** - Mobile framework

### UI & Navigation
- **@react-navigation/native** - Navigation library
- **@react-navigation/bottom-tabs** - Bottom tab navigation
- **@expo/vector-icons** - Icon library

### Data & Storage
- **axios** - HTTP client
- **@react-native-async-storage/async-storage** - Local storage

### Authentication
- **expo-auth-session** - OAuth handling
- **expo-linking** - Deep linking
- **expo-crypto** - Cryptographic operations

### Utilities
- **expo-haptics** - Haptic feedback
- **expo-constants** - App constants
- **date-fns** - Date utilities

## 🐛 Troubleshooting

### Cannot connect to API
- Ensure backend is running
- Check `EXPO_PUBLIC_API_URL` in `.env`
- For physical device, use your computer's IP instead of localhost
- Check firewall settings

### OAuth redirect not working
- Verify deep link configuration in `app.json`
- Rebuild app after changing `app.json`: `npx expo prebuild --clean`
- Check `EXPO_PUBLIC_REDIRECT_URI` matches backend configuration

### App crashes on startup
- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Reset project: `npm run reset-project`

### Build errors
- Update Expo SDK: `npx expo install --fix`
- Check Node version: `node --version` (should be >= 18)
- Clear build cache: `npx expo prebuild --clean`

## 🎨 Customization

### Theme
Edit [styles/theme.ts](styles/theme.ts) to customize colors and styles:

```typescript
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  // ... more colors
};
```

### App Icon & Splash Screen
Replace files in `assets/` directory and update `app.json`:

```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash.png"
  }
}
```

## 📄 Additional Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [Deep Linking Setup](../DEEP_LINKING_SETUP.md)
- [Backend API Documentation](../backend/README.md)

## 👤 Author

Justin Kaulback - [@JKaulback](https://github.com/JKaulback)

## 📄 License

MIT License - See root README for details.

