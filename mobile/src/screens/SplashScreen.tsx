import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="bag-handle" size={44} color={Colors.primary} />
      </View>
      <Text style={styles.title}>BetterTask</Text>
      <Text style={styles.subtitle}>Ecommerce Mobile</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
      <Text style={styles.loadingText}>Restoring session...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
