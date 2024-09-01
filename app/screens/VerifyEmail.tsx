import React, { useState, useRef, createRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../context/AuthContext';

const VerifyEmail = ({ route, navigation }: { route: any, navigation: any }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { userId } = route.params;

    const handleVerifyEmail = async () => {
        if (!otp || otp.length !== 7) {
            Alert.alert('Error', 'Please enter the 7-digit OTP.');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${process.env.API_URL}/users/verify-email`, { userId, otp });
            setLoading(false);

            if (response.data && response.status === 200) {
                Alert.alert('Success', 'Email verified successfully!');
                navigation.navigate('Login');
            } else {
                Alert.alert('Verification Error', response.data.message || 'Failed to verify email. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            console.log('Email verification error:', error);
            Alert.alert('Verification Error', 'Failed to verify email. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.instructions}>Please enter the 7-digit code sent to your email:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                maxLength={7}
                placeholder="1234567"
                placeholderTextColor="#BDBDBD"
            />
            <TouchableOpacity onPress={handleVerifyEmail} style={styles.button} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
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

export default VerifyEmail;