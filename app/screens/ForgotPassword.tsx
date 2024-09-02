import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import axios from 'axios';
import info from '../../assets/question.png';

const ForgotPassword = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }
        if (!/^(?=.*[!@#$%^&*]).{8,}$/.test(newPassword)) {
            Alert.alert('Error', 'Password must be at least 8 characters long and include at least one special character.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/forgot-password`, { email, newPassword });
            setLoading(false);

            if (response.data && response.status === 200) {
                Alert.alert('Success', 'Please check your email for a verification code.');
                navigation.navigate('ForgotPasswordVerify', { email, newPassword });
            } else {
                Alert.alert('Reset Error', response.data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            console.log('Reset password error:', error);
            Alert.alert('Reset Error', 'Failed to reset password. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.infoButton}>
                    <Image source={info} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <Text style={styles.instructions}>Please fill out below fields</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="New Password"
                placeholderTextColor="#BDBDBD"
                onChangeText={setNewPassword}
                value={newPassword}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Confirm New Password"
                placeholderTextColor="#BDBDBD"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={handleResetPassword} style={styles.button} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Reset Password'}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Password Requirements:</Text>
                        <Text style={styles.modalText}>- Must be at least 8 characters long.</Text>
                        <Text style={styles.modalText}>- Must include at least one special character.</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    infoContainer: {
        width: '80%',
        alignItems: 'flex-end'
    },
    infoButton: {
        marginBottom: -18
    },
    icon: {
        width: 18,
        height: 18,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
        width: 70,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ForgotPassword;