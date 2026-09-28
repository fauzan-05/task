import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the API Base URL based on the runtime environment:
 * 1. EXPO_PUBLIC_API_URL if explicitly specified in environment
 * 2. Host IP dynamically detected from Expo Packager (for physical devices running Expo Go)
 * 3. Android Emulator loopback (10.0.2.2:5000/api)
 * 4. iOS Simulator / Web default (http://localhost:5000/api)
 */
export const getApiBaseUrl = (): string => {
  // Check for explicit environment variable first
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Attempt to extract local development machine IP from various Expo host properties
  const expoConstants = Constants as any;
  const rawHost =
    Constants.expoConfig?.hostUri ||
    expoConstants?.expoGoConfig?.debuggerHost ||
    expoConstants?.manifest?.debuggerHost ||
    expoConstants?.manifest2?.extra?.expoGo?.debuggerHost ||
    expoConstants?.manifest2?.extra?.expoClient?.hostUri ||
    Constants.linkingUri ||
    expoConstants?.experienceUrl;

  if (rawHost && typeof rawHost === 'string') {
    // Extract IP or hostname from string (e.g., '192.168.0.77:8081' or 'exp://192.168.0.77:8081')
    const match = rawHost.match(/(?:exp:\/\/|https?:\/\/)?([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
    if (match && match[1] && match[1] !== '127.0.0.1' && match[1] !== '10.0.2.2') {
      return `http://${match[1]}:5000/api`;
    }

    const hostOnly = rawHost.split(':')[0].replace(/^[a-z]+:\/\//, '');
    if (hostOnly && hostOnly !== 'localhost' && hostOnly !== '127.0.0.1') {
      return `http://${hostOnly}:5000/api`;
    }
  }

  // Fallbacks by platform
  if (Platform.OS === 'android') {
    // If not emulator, fall back to LAN IP; emulator uses 10.0.2.2
    return 'http://192.168.0.77:5000/api';
  }

  return 'http://192.168.0.77:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();
