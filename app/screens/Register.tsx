import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/bizmunch-icon-white.png';
import info from '../../assets/question.png';
import { useFormValidation } from '../context/FormValidation';

const Register = ({ navigation }: { navigation: any }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [invitation, setInvitation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [company, setCompany] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { onRegister } = useAuth();
    const { validate, errors } = useFormValidation();

    const validateInvitationCode = async (invitationCode: string) => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/company/validate-invitation-code/${invitationCode}`);
            setCompany(response.data.name);
            return response.data;
        } catch (error) {
            console.log('Error validating invitation code:', error);
            return { valid: false };
        }
    };

    const handleRegister = async () => {
        try {
            // Check if passwords match
            if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
            }
    
            // Validate form inputs
            const isValid = validate({ firstName, lastName, email, invitation, password, confirmPassword });
            if (!isValid) {
                Alert.alert("Validation Error", "Please correct the errors before submitting.");
                return;
            }
    
            // Validate the invitation code
            const invResponse = await validateInvitationCode(invitation);
            if (!invResponse.valid) {
                Alert.alert("Error", "Either Invalid Invitation Code or\nInactive Company");
                return;
            }
    
            // Register the user
            const result = await onRegister(firstName, lastName, email, company, invitation, password);
            if (result && result.error) {
                Alert.alert("Registration Error", result.message);
            } else if (result && result.user && result.user._id) {
                await AsyncStorage.setItem('userDetails', JSON.stringify({
                    userId: result.user._id,
                    email: result.user.email,
                    verified: false
                }));
                Alert.alert("Success", "Verification code has been sent to your email. Please verify your email.");
                navigation.navigate('VerifyEmail', { userId: result.user._id });
            } else {
                Alert.alert("Registration Error", "An unexpected error occurred during registration.");
            }
        } catch (error) {
            Alert.alert("Registration Error", "Something went wrong. Please try again later.");
            console.log('Registration error:', error);
        }
    };
    
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Image source={logo} style={styles.logo} />
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.infoButton}>
                    <Image source={info} style={styles.icon} />
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Registration Requirements:</Text>
                            <Text style={styles.modalText}>- Email must be valid.</Text>
                            <Text style={styles.modalText}>- Password must include at least one special character and be at least 8 characters long.</Text>
                            <Text style={styles.modalText}>- Invitation code must be 8 characters long and contain only uppercase letters and numbers.</Text>
                            <Text style={styles.modalText}>- First name and last name must not exceed 20 characters.</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.form}>
                    <View style={styles.row}>
                        <TextInput 
                            style={[styles.input, styles.inputHalf]}
                            placeholder='First Name'
                            onChangeText={setFirstName}
                            placeholderTextColor='#BDBDBD'
                            value={firstName}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.firstName}</Text>}
                        <TextInput 
                            style={[styles.input, styles.inputHalf]}
                            placeholder='Last Name'
                            onChangeText={setLastName}
                            placeholderTextColor='#BDBDBD'
                            value={lastName}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.lastName}</Text>}
                    </View>
                    <TextInput 
                        style={styles.input}
                        placeholder='Email'
                        onChangeText={setEmail}
                        placeholderTextColor='#BDBDBD'
                        value={email}
                        autoCapitalize='none'
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder='Invitation Code'
                        onChangeText={setInvitation}
                        placeholderTextColor='#BDBDBD'
                        value={invitation}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.invitation}</Text>}
                    <TextInput 
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        placeholderTextColor='#BDBDBD'
                        value={password}
                        autoCapitalize='none'
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.password}</Text>}
                    <TextInput 
                        style={styles.input}
                        placeholder='Confirm Password'
                        secureTextEntry={true}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor='#BDBDBD'
                        value={confirmPassword}
                        autoCapitalize='none'
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    <TouchableOpacity onPress={handleRegister} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text>
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
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
    },
    logo: {
        width: '50%',
        height: 85,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
    infoButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    icon: {
        width: 18,
        height: 18,
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
        color: '#E0E0E0',
    },
    inputHalf: {
        width: '48%',
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
        color: "#E0E0E0",
        fontSize: 16,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    picker: {
        width: '100%',
        height: 44,
        backgroundColor: '#36393e',
        color: '#E0E0E0',
        marginBottom: 10,
    },
    pickerItem: {
        height: 44,
        color: '#E0E0E0',
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
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 2,
    },
});

export default Register;