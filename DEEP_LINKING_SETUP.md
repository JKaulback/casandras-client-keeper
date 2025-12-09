# Deep Linking Setup for Google OAuth

This guide explains how deep linking is configured for mobile OAuth authentication in Casandra's Client Keeper app.

## What is Deep Linking?

Deep linking allows external applications (like web browsers) to open specific screens in your mobile app using a custom URL scheme. When Google OAuth redirects after authentication, it uses the custom scheme `casandras://` to open your app and complete the sign-in flow.

## Configuration Overview

### 1. **App.json Configuration**

The `app.json` file defines the custom URL scheme and platform-specific deep link handling:

```json
{
  "scheme": "casandras",
  "extra": {
    "redirectUri": "casandras://auth/callback"
  }
}
```

#### Android Intent Filters
```json
"android": {
  "intentFilters": [
    {
      "action": "VIEW",
      "autoVerify": true,
      "data": [
        {
          "scheme": "casandras",
          "host": "auth"
        }
      ],
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}
```

This tells Android to:
- Listen for URLs starting with `casandras://auth`
- Open your app when such URLs are encountered
- Mark them as browsable (can be triggered from web browsers)

#### iOS Configuration
```json
"ios": {
  "bundleIdentifier": "com.casandras.clientkeeper",
  "associatedDomains": ["applinks:casandras.app"]
}
```

### 2. **Environment Variables**

**Frontend (.env):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_REDIRECT_URI=casandras://auth/callback
```

**Backend (.env):**
```env
MOBILE_REDIRECT_URI=casandras://auth/callback
FRONTEND_URL=http://localhost:8081
```

### 3. **Authentication Flow**

```
1. User taps "Sign in with Google" 
   ↓
2. App opens browser with: http://localhost:3000/api/auth/google
   ↓
3. User authenticates with Google
   ↓
4. Google redirects to: http://localhost:3000/api/auth/google/callback
   ↓
5. Backend creates JWT token and sets HTTP-only cookie
   ↓
6. Backend redirects to: casandras://auth/callback
   ↓
7. Mobile OS intercepts URL and opens your app
   ↓
8. App navigates to (auth)/callback.tsx screen
   ↓
9. Screen verifies token with backend
   ↓
10. User is redirected to home screen
```

### 4. **Key Files**

**Callback Handler (`app/(auth)/callback.tsx`):**
- Handles the deep link redirect
- Verifies authentication with backend
- Redirects to home on success or back to sign-in on failure

**Auth Service (`services/authService.ts`):**
- Manages OAuth flow
- Opens browser for authentication
- Verifies tokens with backend

**Backend Auth Routes (`backend/src/routes/authRoutes.js`):**
- Handles Google OAuth callback
- Detects mobile vs web clients
- Sets secure HTTP-only cookies
- Redirects to appropriate URI

## Testing Deep Links

### Development with Expo Go

For testing with Expo Go, use the `exp://` scheme:
```env
EXPO_PUBLIC_REDIRECT_URI=exp://localhost:8081
```

### Standalone Builds

For production or development builds (not Expo Go):
```env
EXPO_PUBLIC_REDIRECT_URI=casandras://auth/callback
```

### Testing on Physical Devices

1. Update `.env` with your machine's IP:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.x:3000
   EXPO_PUBLIC_REDIRECT_URI=exp://192.168.1.x:8081
   ```

2. Find your IP:
   ```powershell
   ipconfig
   ```

3. Restart Expo:
   ```powershell
   npm start -- --clear
   ```

## Troubleshooting

### Deep Link Not Opening App

1. **Check the scheme in app.json matches your redirect URI:**
   - Scheme: `casandras`
   - URI: `casandras://auth/callback`

2. **Rebuild the app after changing app.json:**
   ```powershell
   npx expo run:android
   # or
   npx expo run:ios
   ```

3. **For Android, verify intent filters are registered:**
   ```powershell
   adb shell dumpsys package | findstr casandras
   ```

### Authentication Fails

1. **Check backend logs** for redirect URI
2. **Verify cookies are being set** in browser dev tools
3. **Ensure CORS allows credentials:**
   ```javascript
   credentials: true
   ```

### Expo Go vs Standalone

- **Expo Go**: Uses `exp://` scheme managed by Expo
- **Standalone**: Uses custom `casandras://` scheme

Choose the appropriate `EXPO_PUBLIC_REDIRECT_URI` based on your build type.

## Security Considerations

1. **HTTP-only cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript
2. **Secure flag**: Ensures cookies only sent over HTTPS in production
3. **SameSite**: Prevents CSRF attacks
4. **JWT expiration**: Tokens expire after 7 days
5. **Deep link validation**: Always verify authentication on callback screen

## Production Checklist

- [ ] Update `EXPO_PUBLIC_API_URL` to production backend URL
- [ ] Set `EXPO_PUBLIC_REDIRECT_URI` to `casandras://auth/callback`
- [ ] Update Google OAuth redirect URIs in Google Cloud Console
- [ ] Add production domain to `associatedDomains` in iOS config
- [ ] Enable `secure` flag for cookies (`NODE_ENV=production`)
- [ ] Test deep linking on both iOS and Android devices
- [ ] Verify token expiration and refresh logic

## Additional Resources

- [Expo Linking Documentation](https://docs.expo.dev/guides/linking/)
- [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking/)
- [Android Intent Filters](https://developer.android.com/training/app-links)
- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
