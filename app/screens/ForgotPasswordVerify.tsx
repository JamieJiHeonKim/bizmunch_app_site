import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordVerify = ({ navigation, route }: { navigation: any, route: any }) => {
    const { email, newPassword } = route.params;
    const [verificationCode, setVerificationCode] = useState('');
    const { setLoading } = useAuth();

    const handleVerifyEmail = async () => {
        if (!verificationCode) {
            Alert.alert('Error', 'Please enter the verification code.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/verify-forgot-password`, {
                email,
                newPassword,
                verificationCode,
            });
            setLoading(false);

            if (response.data && response.status === 200) {
                Alert.alert('Success', 'Your password has been reset successfully.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Verification Error', response.data.message || 'Failed to verify. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            console.log('Email verification error:', error);
            Alert.alert('Verification Error', 'Failed to verify. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.instructions}>Please enter the code sent to your email</Text>
            <TextInput
                style={styles.input}
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Enter verification code"
                placeholderTextColor="#BDBDBD"
                keyboardType="number-pad"
            />
            <TouchableOpacity onPress={handleVerifyEmail} style={styles.button}>
                <Text style={styles.buttonText}>Verify Email</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#121212',
    },
    instructions: {
        fontSize: 16,
        color: '#E0E0E0',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#36393e',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#E0E0E0',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#c65102',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#E0E0E0',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ForgotPasswordVerify;