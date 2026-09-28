import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Product } from '../types';
import { productService } from '../services/product.service';
import { Colors } from '../constants/colors';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { addToCart, isUpdatingItemId } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const isAdding = isUpdatingItemId === productId;

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await productService.getProductById(productId);
      if (res && res.product) {
        setProduct(res.product);
        setQuantity(1);
      } else {
        setErrorMessage('Product details not found.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load product details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleIncrement = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      Alert.alert('Stock Limit Reached', `Only ${product.stock} items available in stock.`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add items to your shopping cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth', { screen: 'Login' } as any) },
        ]
      );
      return;
    }

    if (product.stock <= 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    const res = await addToCart(product._id, quantity);
    if (res.success) {
      Alert.alert(
        'Added to Cart! 🛒',
        `Added ${quantity} × "${product.name}" to your cart.`,
        [
          { text: 'Keep Shopping', style: 'cancel' },
          {
            text: 'View Cart',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'CartTab' });
            },
          },
        ]
      );
    } else {
      Alert.alert('Could Not Add to Cart', res.error || 'Failed to add item to cart.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (errorMessage || !product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.errorCircle}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        </View>
        <Text style={styles.errorTitle}>Unable to load product</Text>
        <Text style={styles.errorSubtitle}>{errorMessage || 'Product not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProductDetails}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          {product.category}
        </Text>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => setIsFavorite(!isFavorite)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? Colors.danger : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageError || !product.image ? (
            <View style={styles.imageFallback}>
              <Ionicons name="image-outline" size={64} color={Colors.textMuted} />
            </View>
          ) : (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          )}

          {/* Badges Overlay */}
          <View style={styles.badgeRow}>
            {isOutOfStock ? (
              <View style={[styles.badge, styles.badgeOutOfStock]}>
                <Text style={styles.badgeText}>Out of Stock</Text>
              </View>
            ) : product.isBestseller ? (
              <View style={[styles.badge, styles.badgeBestseller]}>
                <Text style={styles.badgeText}>Bestseller</Text>
              </View>
            ) : product.badge ? (
              <View style={[styles.badge, styles.badgeCustom]}>
                <Text style={styles.badgeText}>{product.badge}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Product Info Section */}
        <View style={styles.infoCard}>
          {/* Category & Rating */}
          <View style={styles.metaRow}>
            <Text style={styles.categoryBadge}>{product.category}</Text>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingScore}>{product.rating ? product.rating.toFixed(1) : '4.9'}</Text>
              <Text style={styles.ratingCount}>({product.reviewsCount || 24} reviews)</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Price & Stock Badge */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={[styles.stockBadge, isOutOfStock ? styles.stockBadgeOut : styles.stockBadgeIn]}>
              <Ionicons
                name={isOutOfStock ? 'close-circle' : 'checkmark-circle'}
                size={14}
                color={isOutOfStock ? Colors.danger : Colors.accent}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.stockBadgeText, isOutOfStock ? styles.stockTextOut : styles.stockTextIn]}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
              </Text>
            </View>
          </View>

          {/* Quantity Selector (when in stock) */}
          {!isOutOfStock && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionHeading}>Select Quantity</Text>
              <View style={styles.quantityControlsRow}>
                <TouchableOpacity
                  style={[styles.qtyButton, quantity <= 1 && styles.qtyButtonDisabled]}
                  onPress={handleDecrement}
                  disabled={quantity <= 1 || isAdding}
                >
                  <Ionicons name="remove" size={18} color={quantity <= 1 ? Colors.textMuted : Colors.text} />
                </TouchableOpacity>

                <View style={styles.qtyDisplay}>
                  <Text style={styles.qtyText}>{quantity}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.qtyButton, quantity >= product.stock && styles.qtyButtonDisabled]}
                  onPress={handleIncrement}
                  disabled={quantity >= product.stock || isAdding}
                >
                  <Ionicons name="add" size={18} color={quantity >= product.stock ? Colors.textMuted : Colors.text} />
                </TouchableOpacity>

                <Text style={styles.stockNotice}>Max: {product.stock}</Text>
              </View>
            </View>
          )}

          {/* Colors (if available) */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.colorSection}>
              <Text style={styles.sectionHeading}>Available Colors / Options</Text>
              <View style={styles.colorPillsRow}>
                {product.colors.map((color, index) => (
                  <View key={index} style={styles.colorPill}>
                    <Text style={styles.colorPillText}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceInfoLabel}>Total ({quantity} item{quantity > 1 ? 's' : ''})</Text>
          <Text style={styles.priceInfoAmount}>${totalPrice}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, (isOutOfStock || isAdding) && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          activeOpacity={0.8}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addToCartButtonText}>
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.background,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  backLink: {
    padding: 8,
  },
  backLinkText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    maxWidth: 200,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  badgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeBestseller: {
    backgroundColor: '#0F172A',
  },
  badgeOutOfStock: {
    backgroundColor: Colors.danger,
  },
  badgeCustom: {
    backgroundColor: Colors.primary,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 3,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 28,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  stockBadgeIn: {
    backgroundColor: '#ECFDF5',
  },
  stockBadgeOut: {
    backgroundColor: '#FEF2F2',
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stockTextIn: {
    color: Colors.accent,
  },
  stockTextOut: {
    color: Colors.danger,
  },
  quantitySection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  quantityControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyDisplay: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  stockNotice: {
    marginLeft: 14,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  colorSection: {
    marginBottom: 20,
  },
  colorPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  colorPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
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
  priceInfo: {
    flex: 1,
  },
  priceInfoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceInfoAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 150,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
