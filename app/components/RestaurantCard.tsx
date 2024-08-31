import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Restaurant {
  _id: string;
  name: string;
  logo: string;
  category: string;
  location: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  togglePin: (id: string) => void;
  pinned: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress, togglePin, pinned }) => {
  const handlePinPress = () => {
    togglePin(restaurant?._id);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: restaurant.logo }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text style={styles.details}>{restaurant.category}</Text>
        <Text style={styles.details}>{restaurant.location}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handlePinPress}>
          <Icon name={pinned ? 'pin' : 'pin-off'} size={20} color={pinned ? '#ff6347' : 'grey'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#ffffff',
  },
  details: {
    fontSize: 14,
    color: '#dddddd',
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  categoryIcon: {
    marginTop: 20,
  },
});

export default RestaurantCard;
