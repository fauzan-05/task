import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors } from '../constants/colors';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  const { totalQuantity } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Colors.text,
        },
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ProductsTab':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'CartTab':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'BetterTask Store',
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsScreen}
        options={{
          title: 'Products',
          headerTitle: 'Browse Catalog',
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Cart',
          headerTitle: 'Your Cart',
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.primary,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Account',
          headerTitle: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
};
