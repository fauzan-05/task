import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ProductsTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  // Placeholders for future detail screens
  ProductDetails: { productId: string };
  Checkout: undefined;
};

// Helper Screen Props
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type TabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;
