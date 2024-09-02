import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/bizmunch-icon-white.png';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    ForgotPassword: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, setAuthState } = useAuth();
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleLogin = async () => {
        try {
            const result = await onLogin(email, password);
            console.log('result:', result);
            if (result.error) {
                Alert.alert("Login Error", result.message || 'Login failed, please check your credentials.');
            } else {
                const token = result.token || '';
                const user = result.user || null;
                const pinnedRestaurants = result.pinnedRestaurants || [];

                await AsyncStorage.setItem('authState', JSON.stringify({
                    token,
                    user,
                    authenticated: true,
                    pinnedRestaurants
                }));
                setAuthState({
                    token,
                    user,
                    authenticated: true,
                    pinnedRestaurants
                });
                Alert.alert("Login Successful", "You are now logged in.");
                navigation.navigate('Home');
            }
        } catch (error: any) {
            console.log('Login error:', error);
            Alert.alert('Login failed', error?.response?.data?.message || 'Unexpected error occurred, please try again.');
        }
    };

    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    const navigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Image source={logo} style={styles.logo} />
                <View style={styles.form}>
                    <TextInput 
                        style={styles.input}
                        placeholder='Email'
                        placeholderTextColor='#BDBDBD'
                        onChangeText={setEmail}
                        value={email}
                        autoCapitalize='none'
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder='Password'
                        placeholderTextColor='#BDBDBD'
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        autoCapitalize='none'
                    />

                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToRegister} style={styles.button}>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={{ alignSelf: 'flex-end', marginBottom: 10 }}
                    >
                        <Text style={{ color: '#c65102' }}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    keyboardView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    form: {
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 44,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#36393e',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#36393e',
        color: '#FFFAFA',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    smallButton: {
        paddingBottom: 10,
    },
    smallButtonText: {
        color: '#FFFAFA',
        fontSize: 14,
    },
    button: {
        width: '100%',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c65102',
        marginTop: 10,
    },
    buttonText: {
        color: "#FFFAFA",
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default Login;