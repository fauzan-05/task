import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Product } from '../types';
import { productService } from '../services/product.service';
import { ProductCard } from '../components/ProductCard';
import { CategoryPills } from '../components/CategoryPills';
import { Colors } from '../constants/colors';

export const ProductsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch Categories on mount
  const fetchCategories = async () => {
    try {
      const res = await productService.getCategories();
      if (res && res.categories) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.warn('[ProductsScreen] Failed to load categories:', err);
    }
  };

  // Fetch Products based on current filters
  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      const params: { category?: string; search?: string } = {};
      if (selectedCategory && selectedCategory.trim() !== '') {
        params.category = selectedCategory;
      }
      if (searchQuery && searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
      }

      const res = await productService.getProducts(params);
      if (res && res.products) {
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to load products. Please check your connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { productId: product._id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by title or description..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills */}
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        isLoading={isLoading || isRefreshing}
      />

      {/* Content Area */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching products...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorCircle}>
            <Ionicons name="cloud-offline-outline" size={44} color={Colors.danger} />
          </View>
          <Text style={styles.errorTitle}>Failed to load products</Text>
          <Text style={styles.errorSubtitle}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts()} activeOpacity={0.8}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchProducts(true)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={handleProductPress} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCircle}>
                <Ionicons name="search-outline" size={40} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedCategory
                  ? 'Try clearing your search query or selecting a different category.'
                  : 'No products are currently available in the catalog.'}
              </Text>
              {(searchQuery || selectedCategory) && (
                <TouchableOpacity
                  style={styles.resetFilterButton}
                  onPress={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.resetFilterButtonText}>Reset Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  errorCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
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
    marginBottom: 18,
    maxWidth: 280,
    lineHeight: 18,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 280,
  },
  resetFilterButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resetFilterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
