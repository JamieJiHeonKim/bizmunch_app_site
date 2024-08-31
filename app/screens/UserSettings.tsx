import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const UserSettings = ({ navigation }: { navigation: any }) => {
    const { authState, onUserPasswordUpdate } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
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

        const response = await onUserPasswordUpdate(currentPassword, newPassword);
        if (response.error) {
            Alert.alert('Error', response.message);
        } else {
            Alert.alert('Success', 'Password updated successfully.');
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        // Fetch user data from authState when the component mounts
        if (!authState.user) {
            Alert.alert('Error', 'Unable to fetch user data.');
            navigation.navigate('Login');
        }
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{authState.user?.name}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Company Name</Text>
                        <Text style={styles.value}>{authState.user?.company?.name}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{authState.user?.email}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Current Password"
                            placeholderTextColor="#666"
                            onChangeText={setCurrentPassword}
                            value={currentPassword}
                        />
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="New Password"
                            placeholderTextColor="#666"
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Confirm New Password"
                            placeholderTextColor="#666"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
                        <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
    },
    infoBlock: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#BBBBBB',
        marginBottom: 10,
    },
    input: {
        height: 50,
        backgroundColor: '#333333',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#444',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#c65102',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserSettings;
