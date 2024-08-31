import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoriesList from './CategoriesList';
import RestaurantList from './RestaurantList';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomTab = createBottomTabNavigator();

const Home = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.screen}>
            <RestaurantList />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },
    screen: {
        flex: 1,
    }
});

export default Home;