import React from 'react';
import { createNativeStackNavigator, NavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import Login from '../screens/Login';
import Register from '../screens/Register';
import VerifyEmail from '../screens/VerifyEmail';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotPasswordVerify from '../screens/ForgotPasswordVerify';
import VerifyOTP from '../screens/VerifyOTP';
import Icon from 'react-native-vector-icons/Ionicons';
import logoIcon from '../../assets/bizmunch-icon-white.png';


type RootStackParamList = {
    Login: undefined;
    VerifyEmail: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ForgotPasswordVerify: undefined;
    VerifyOTP: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <Stack.Navigator 
            screenOptions={{
                headerTitleAlign: 'center',
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ForgotPasswordVerify" component={ForgotPasswordVerify} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 50,
    }
});

export default AuthNavigator;
