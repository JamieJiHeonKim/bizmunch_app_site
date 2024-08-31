import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import axios from 'axios';
import { FlatList, StyleSheet, View } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import CategoryItem from './CategoryItem';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Restaurant {
  _id: string;
  logo: string;
  name: string;
  category: string;
  location: string;
  barcode: string;
}

const categories: Category[] = [
  { id: '1', name: 'Diner', icon: 'silverware-fork-knife' },
  { id: '2', name: 'Sandwich', icon: 'food' },
  { id: '3', name: 'Pizza', icon: 'pizza' },
  { id: '4', name: 'Asian', icon: 'rice' },
  { id: '5', name: 'Vegie', icon: 'leaf' },
  { id: '6', name: 'Café', icon: 'coffee' },
  { id: '7', name: 'Spicy', icon: 'chili-hot' },
  { id: '8', name: 'Drink', icon: 'cup' },
];

const RestaurantList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigation = useNavigation();
  const { authState, togglePin } = useContext(AuthContext)!;

  const filteredRestaurants = useMemo(() => {
    if (!authState || !Array.isArray(authState.pinnedRestaurants)) {
        return restaurants;
    }
    const filtered = restaurants.filter(
      (restaurant) => !selectedCategory || restaurant.category === selectedCategory
    );
    const pinnedRestaurants = filtered.filter((r) => authState.pinnedRestaurants?.includes(r._id));
    const nonPinnedRestaurants = filtered.filter((r) => !authState.pinnedRestaurants?.includes(r._id));
    return [...pinnedRestaurants, ...nonPinnedRestaurants];
  }, [selectedCategory, authState?.pinnedRestaurants, restaurants]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetails', { restaurant });
  };

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/restaurant/allrestaurants`);
  //       setRestaurants(response.data);
  //     } catch (error) {
  //       console.error('Error fetching restaurants:', error);
  //     }
  //   };

  //   fetchRestaurants();
  // }, []);

  useEffect(() => {
    const fetchRotatedRestaurants = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/users/rotated-restaurants/${authState.user?.id}`);
            setRestaurants(response.data);
        } catch (error) {
            console.log('Error fetching rotated restaurants:', error);
        }
    };

    if (authState.user?.id) {
        fetchRotatedRestaurants();
    }
  }, [authState.user?.id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        renderItem={({ item }) => (
          <CategoryItem
            name={item.name}
            iconName={item.icon}
            isSelected={selectedCategory === item.name}
            onPress={() => toggleCategory(item.name)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 60 }}
      />
      <FlatList
        data={filteredRestaurants}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => handleRestaurantPress(item)}
            togglePin={togglePin}
            pinned={authState?.pinnedRestaurants?.includes(item._id) || false}
          />
        )}
        keyExtractor={(restaurant) => restaurant._id.toString()}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: filteredRestaurants.length ? 'flex-start' : 'center',
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    paddingHorizontal: 10,
    backgroundColor: '#121212',
  },
});

export default RestaurantList;
