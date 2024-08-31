import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CategoryItemProps {
  name: string;
  iconName: string;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, iconName, isSelected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, isSelected && styles.iconSelected]}>
        <Icon name={iconName} size={24} color={isSelected ? 'orange' : 'white'} />
      </View>
      <Text style={[styles.text, isSelected && styles.textSelected]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSelected: {
    backgroundColor: '#666',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  textSelected: {
    color: 'orange',
  },
});

export default CategoryItem;
