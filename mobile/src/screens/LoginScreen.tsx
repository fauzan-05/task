import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { AuthScreenProps } from '../navigation/types';

export const LoginScreen: React.FC<AuthScreenProps<'Login'>> = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    // Client validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to login. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="bag-handle" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your BetterTask account</Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={Colors.danger} style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Demo Account Fillers */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Sign In</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoBadge}
                onPress={() => fillDemoAccount('demo@gmail.com', 'password123')}
              >
                <Text style={styles.demoBadgeText}>Customer Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBadge}
                onPress={() => fillDemoAccount('admin@gmail.com', 'admin123')}
              >
                <Text style={styles.demoBadgeText}>Admin Demo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Link to Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  demoSection: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
