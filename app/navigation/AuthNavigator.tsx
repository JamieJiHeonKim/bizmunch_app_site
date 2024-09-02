import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import VerifyEmail from '../screens/VerifyEmail';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotPasswordVerify from '../screens/ForgotPasswordVerify';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ForgotPasswordVerify" component={ForgotPasswordVerify} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
