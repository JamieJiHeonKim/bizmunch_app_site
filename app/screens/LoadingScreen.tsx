// In LoadingScreen.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import logoIcon from '../../assets/bizmunch-icon-white.png';

const LoadingScreen = () => {
    const { setLoading, authState } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        async function checkLoginStatus() {
            setLoading(false);
            if (authState.user && authState.authenticated) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AppNavigator' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthNavigator' }],
                });
            }
        }
        checkLoginStatus();
    }, [navigation, setLoading, authState]);

    return (
        <View style={styles.container}>
            <Image source={logoIcon} style={styles.logo} />
            <ActivityIndicator size="large" color="#c65102" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    logo: {
        width: 120,
        height: 120,
    },
    indicator: {
        position: 'absolute',
    }
});

export default LoadingScreen;
