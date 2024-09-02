import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
    const { onResetPassword } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params as { email: string };
    const [otp, setOtp] = useState<string>('');

    const handleVerifyOtp = async () => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (!data.success) {
            Alert.alert("Error", data.message || "Failed to verify OTP. Please try again.");
        } else {
            Alert.alert("Success", "Your password has been reset successfully.");
            navigation.replace('Login');
        }
    };
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                />
                <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '80%',
        height: 44,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#36393e',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#36393e',
        color: '#E0E0E0',
    },
    button: {
        width: '80%',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c65102',
    },
    buttonText: {
        color: "#E0E0E0",
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default VerifyOTP;
