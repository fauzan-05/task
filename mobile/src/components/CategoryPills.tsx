import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading?: boolean;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}) => {
  const allCategories = ['All', ...categories];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {allCategories.map((category) => {
          const isSelected =
            selectedCategory.toLowerCase() === category.toLowerCase() ||
            (selectedCategory === '' && category === 'All');

          return (
            <TouchableOpacity
              key={category}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() => onSelectCategory(category === 'All' ? '' : category)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
