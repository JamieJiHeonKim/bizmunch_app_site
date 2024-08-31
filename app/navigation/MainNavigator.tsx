import React from 'react';
import { Button, Image, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import VerifyEmail from '../screens/VerifyEmail';
import logoIcon from '../../assets/bizmunch-icon-white.png';
import CustomButton from '../components/CustomButton';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const { onLogout } = useAuth();
    return (
        <NavigationContainer>
            <StatusBar backgroundColor="#121212" barStyle="light-content" />
            <Stack.Navigator
                screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                }}
            >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen 
                name="Home" 
                component={Home}
                options={({ navigation }) => ({
                    headerRight: () => (
                        <CustomButton
                            onPress={() => {
                                onLogout();
                                navigation.navigate('Login');
                            }} 
                            title="Sign Out"
                        />
                    ),
                    headerTitle: () => (
                        <Image 
                            source={logoIcon}
                            style={{ width: 100, height: 50 }}
                            resizeMode="contain"
                        />
                    ),
                    headerTitleAlign: 'center',
                    headerLeft: () => null,
                    headerStyle: {
                        backgroundColor: '#121212',
                    },
                    headerTintColor: '#fff',
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>                
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    }
});

export default MainNavigator;
