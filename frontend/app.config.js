export default {
  expo: {
    name: "Scissors and Sudz",
    slug: "casandras-client-keeper",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FAF9FC"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.casandras.clientkeeper"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FAF9FC"
      },
      package: "com.casandras.clientkeeper"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Environment variables accessible via Constants.expoConfig.extra
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    }
  }
};
