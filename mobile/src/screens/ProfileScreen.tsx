import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../config/env';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const currentApiUrl = getApiBaseUrl();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user?.role ? user.role.toUpperCase() : 'USER'}
            </Text>
          </View>
        </View>

        {/* Account Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Session Information</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Auth Status</Text>
            </View>
            <Text style={styles.detailValueActive}>Active JWT Session</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="server-outline" size={18} color={Colors.textMuted} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Backend API</Text>
            </View>
            <Text style={styles.detailValueMonospace}>{currentApiUrl}</Text>
          </View>

          {user?.createdAt && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLabelRow}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} style={styles.detailIcon} />
                  <Text style={styles.detailLabel}>Member Since</Text>
                </View>
                <Text style={styles.detailValue}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  detailValueActive: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  detailValueMonospace: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    maxWidth: 180,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    height: 52,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.danger,
  },
});
