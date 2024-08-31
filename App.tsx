import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar, View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import logoIcon from './assets/bizmunch-icon-white.png'; // Ensure the path to this image is correct

const Stack = createStackNavigator();

const App = () => {
  const { authState, loading } = useAuth();

  useEffect(() => {
    StatusBar.setBackgroundColor('#121212');
    StatusBar.setBarStyle('light-content');
    NavigationBar.setBackgroundColorAsync('#121212');
    NavigationBar.setButtonStyleAsync('light');
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={logoIcon} style={styles.logo} />
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authState.authenticated ? (
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
        ) : (
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});

const AppContainer = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

registerRootComponent(AppContainer);
