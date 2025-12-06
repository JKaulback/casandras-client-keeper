/**
 * API Configuration
 * Centralized API endpoint and configuration
 */

// Android emulator uses 10.0.2.2 to reach host machine's localhost
// iOS simulator and web use localhost
// For physical device, use your computer's IP address (e.g., "http://192.168.1.x:3000")
const API_BASE_URL = "http://10.0.2.2:3000/api";

export default API_BASE_URL;
