import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Safe wrapper around expo-secure-store with platform compatibility fallbacks.
 */
export const StorageService = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`[StorageService] Failed to set item for key: ${key}`, error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to get item for key: ${key}`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to remove item for key: ${key}`, error);
    }
  },

  // Specialized helpers for Auth Token
  async setAuthToken(token: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async removeAuthToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};
