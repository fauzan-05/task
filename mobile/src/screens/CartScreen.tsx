import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types';
import { Colors } from '../constants/colors';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const {
    cart,
    totalQuantity,
    totalAmount,
    isLoading,
    isUpdatingItemId,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCart(true);
    setIsRefreshing(false);
  };

  const handleIncrement = async (item: CartItem) => {
    const currentQty = item.quantity;
    const maxStock = item.product.stock;

    if (currentQty >= maxStock) {
      Alert.alert(
        'Stock Limit Reached',
        `Sorry, only ${maxStock} units of "${item.product.name}" are currently available in stock.`
      );
      return;
    }

    const res = await updateQuantity(item.product._id, currentQty + 1);
    if (!res.success) {
      Alert.alert('Update Failed', res.error || 'Could not update quantity.');
    }
  };

  const handleDecrement = async (item: CartItem) => {
    const currentQty = item.quantity;

    if (currentQty <= 1) {
      handleRemoveItem(item);
      return;
    }

    const res = await updateQuantity(item.product._id, currentQty - 1);
    if (!res.success) {
      Alert.alert('Update Failed', res.error || 'Could not update quantity.');
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${item.product.name}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const res = await removeFromCart(item.product._id);
            if (!res.success) {
              Alert.alert('Removal Failed', res.error || 'Could not remove item.');
            }
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (!cart || !cart.items || cart.items.length === 0) return;

    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const res = await clearCart();
            if (!res.success) {
              Alert.alert('Clear Failed', res.error || 'Could not clear cart.');
            }
          },
        },
      ]
    );
  };

  const handleProceedToCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    Alert.alert(
      'Checkout',
      `Total to pay: $${totalAmount.toFixed(2)}. Checkout and order placement will be finalized in Phase 5.`,
      [{ text: 'OK' }]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const isItemUpdating = isUpdatingItemId === item.product._id;
    const isOutOfStock = item.product.stock <= 0;
    const isAtMaxStock = item.quantity >= item.product.stock;

    return (
      <View style={styles.itemCard}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.product.image ? (
            <Image
              source={{ uri: item.product.image }}
              style={styles.itemImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Ionicons name="image-outline" size={24} color={Colors.textMuted} />
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemCategory}>{item.product.category}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item)}
              disabled={isItemUpdating}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemName} numberOfLines={2}>
            {item.product.name}
          </Text>

          <Text style={styles.itemPrice}>${item.product.price.toFixed(2)} each</Text>

          {/* Quantity Controls & Subtotal */}
          <View style={styles.itemFooter}>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleDecrement(item)}
                disabled={isItemUpdating}
              >
                <Ionicons
                  name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                  size={16}
                  color={item.quantity === 1 ? Colors.danger : Colors.text}
                />
              </TouchableOpacity>

              <View style={styles.qtyNumberBox}>
                {isItemUpdating ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.qtyNumber}>{item.quantity}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.qtyButton, (isAtMaxStock || isOutOfStock) && styles.qtyButtonDisabled]}
                onPress={() => handleIncrement(item)}
                disabled={isAtMaxStock || isOutOfStock || isItemUpdating}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={isAtMaxStock || isOutOfStock ? Colors.textMuted : Colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalAmount}>${item.subtotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed-outline" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Sign In to View Cart</Text>
          <Text style={styles.emptySubtitle}>
            Please sign in with your account to access your personal shopping cart.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !isRefreshing && !cart) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !cart) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <View style={styles.errorCircle}>
            <Ionicons name="cloud-offline-outline" size={44} color={Colors.danger} />
          </View>
          <Text style={styles.errorTitle}>Could not load cart</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refreshCart()}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      {!isEmpty && (
        <View style={styles.cartHeaderRow}>
          <Text style={styles.cartHeaderCount}>
            {totalQuantity} item{totalQuantity !== 1 ? 's' : ''} in cart
          </Text>
          <TouchableOpacity onPress={handleClearCart} style={styles.clearCartButton}>
            <Ionicons name="trash-outline" size={14} color={Colors.textMuted} style={{ marginRight: 4 }} />
            <Text style={styles.clearCartText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.product._id}
        renderItem={renderCartItem}
        contentContainerStyle={[styles.listContent, isEmpty && styles.emptyListContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>
              <Ionicons name="cart-outline" size={54} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven't added anything to your cart yet. Explore our catalog and find great deals!
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('ProductsTab')}
              activeOpacity={0.85}
            >
              <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.browseButtonText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          !isEmpty ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({totalQuantity} items)</Text>
                <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Estimate</Text>
                <Text style={styles.freeShippingBadge}>FREE</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes</Text>
                <Text style={styles.summaryValue}>Calculated at checkout</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Estimated Total</Text>
                <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Floating Checkout Bottom Bar */}
      {!isEmpty && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPriceInfo}>
            <Text style={styles.bottomTotalLabel}>Total Amount</Text>
            <Text style={styles.bottomTotalAmount}>${totalAmount.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleProceedToCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cartHeaderCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  clearCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: 4,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonDisabled: {
    opacity: 0.3,
  },
  qtyNumberBox: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  subtotalContainer: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  subtotalAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  freeShippingBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accent,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 290,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  errorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 280,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPriceInfo: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomTotalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
