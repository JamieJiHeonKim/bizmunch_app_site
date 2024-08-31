import React, { useState, useCallback } from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import CategoryItem from './CategoryItem';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: '1', name: 'Pizza', icon: 'pizza' },
  { id: '2', name: 'Burger', icon: 'hamburger' },
  { id: '3', name: 'Sushi', icon: 'rice' },
];

const CategoriesList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }, []);

  if (!categories.length) {
    return <Text style={styles.loadingText}>Loading categories...</Text>; // Loading indicator
  }

  return (
    <FlatList
      data={categories}
      horizontal
      renderItem={({ item }) => (
        <CategoryItem
          name={item.name}
          iconName={item.icon}
          isSelected={selectedCategory === item.icon}
          onPress={() => toggleCategory(item.icon)}
        />
      )}
      keyExtractor={item => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  list: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default CategoriesList;
