import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/product.service';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadHomeData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);

      if (productsRes && productsRes.products) {
        setFeaturedProducts(productsRes.products.slice(0, 4));
      }
      if (categoriesRes && categoriesRes.categories) {
        setCategories(categoriesRes.categories);
      }
    } catch (error) {
      console.warn('[HomeScreen] Failed to load featured products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { productId: product._id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadHomeData(true)}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {user?.name ? `Hello, ${user.name.split(' ')[0]} 👋` : 'Welcome to BetterTask 👋'}
            </Text>
            <Text style={styles.subGreeting}>Discover our latest premium products</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Summer Sale</Text>
            </View>
            <Text style={styles.heroTitle}>Exclusive Deals on Tech & Audio</Text>
            <Text style={styles.heroSubtitle}>Top quality gear with fast worldwide shipping</Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('ProductsTab')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>Shop Catalog</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('ProductsTab')}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryIconCircle}>
                    <Ionicons name="grid" size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.categoryCardText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
              <Text style={styles.seeAllText}>View All ({featuredProducts.length})</Text>
            </TouchableOpacity>
          </View>

          {isLoading && !isRefreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading featured items...</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <View key={product._id} style={styles.gridItem}>
                  <ProductCard product={product} onPress={handleProductPress} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 18,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  categoriesRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.textMuted,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gridItem: {
    width: '50%',
  },
});
