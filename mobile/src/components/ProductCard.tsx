import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { Colors } from '../constants/colors';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock <= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.85}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {imageError || !product.image ? (
          <View style={styles.fallbackContainer}>
            <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
          </View>
        ) : (
          <>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {imageLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            )}
          </>
        )}

        {/* Badges */}
        <View style={styles.badgeContainer}>
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

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>

        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {product.rating ? product.rating.toFixed(1) : '4.8'}
          </Text>
          {product.reviewsCount ? (
            <Text style={styles.reviewsCount}>({product.reviewsCount})</Text>
          ) : null}
        </View>

        {/* Price & Stock */}
        <View style={styles.footerRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text
            style={[
              styles.stockText,
              isOutOfStock ? styles.stockOut : styles.stockIn,
            ]}
          >
            {isOutOfStock ? 'Sold Out' : `${product.stock} left`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  content: {
    padding: 10,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
    height: 36,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 3,
  },
  reviewsCount: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockIn: {
    color: Colors.accent,
  },
  stockOut: {
    color: Colors.danger,
  },
});
