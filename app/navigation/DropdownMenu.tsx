import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DropdownMenu = memo(({ onOptionSelect }: { onOptionSelect: (key: string) => void }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
    const options = [
        { key: 'settings', label: 'Settings' },
        // { key: 'data', label: 'Data' },
        { key: 'signOut', label: 'Sign Out' }
    ];

    const handleOptionSelect = (key: string) => {
        if (key === 'signOut') {
            setConfirmLogoutVisible(true);
        } else {
            onOptionSelect(key);
        }
        setIsVisible(false);
    };

    return (
        <View style={{ marginRight: 10 }}>
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                <Icon name="account-circle" size={30} color="#fff" />
            </TouchableOpacity>
            {isVisible && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isVisible}
                    onRequestClose={() => setIsVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setIsVisible(false)}
                        activeOpacity={1}
                    >
                        <View style={styles.optionsContainer}>
                            <FlatList
                                data={options}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => handleOptionSelect(item.key)}
                                    >
                                        <Text style={styles.optionText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={option => option.key}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
            {/* Confirmation Modal for Logging Out */}
            <Modal
                transparent={true}
                visible={confirmLogoutVisible}
                animationType="slide"
                onRequestClose={() => setConfirmLogoutVisible(false)}
            >
                <TouchableOpacity
                    style={styles.centeredModalOverlay}
                    activeOpacity={1}
                    onPress={() => setConfirmLogoutVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.confirmationBox}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={styles.confirmationText}>Are you sure you want to log out?</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Log Out" onPress={() => {
                                setConfirmLogoutVisible(false);
                                onOptionSelect('signOut');
                            }} color="#c65102" />
                            <Button title="Cancel" onPress={() => setConfirmLogoutVisible(false)} color="#c65102" />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
});


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    optionsContainer: {
        backgroundColor: '#36393e',
        borderRadius: 10,
        width: 200,
        overflow: 'hidden',
        marginTop: 50,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
        color: '#fff',
    },
    centeredModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    confirmationBox: {
        backgroundColor: '#2c2f33',
        padding: 30,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    confirmationText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default DropdownMenu;