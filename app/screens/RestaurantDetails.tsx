import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, Button, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Collapsible from 'react-native-collapsible';
import SampleBarcode from '../../assets/sample_barcode.png';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import GarlicBreadImage from '../../assets/garlic_bread.png';

interface Restaurant {
    name: string;
    location: string;
    category: string;
    barcode: string;
    _id: string;
}

interface MenuItem {
    name: string;
    price: string;
    calories: string;
    ingredients: string[];
    description: string;
    image: any;
}

const RestaurantDetail = ({ route }: { route: { params: { restaurant: Restaurant } } }) => {
    const { restaurant } = route.params;
    const [mapModalVisible, setMapModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [noMenuMessage, setNoMenuMessage] = useState<string | null>(null);
    const [averagePrice, setAveragePrice] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(`${process.env.API_URL}/restaurant/${restaurant._id}/menu`);
                const data = response.data;

                if (response.status === 404 && data.message) {
                    setNoMenuMessage(data.message);
                    setMenuData([]);
                } else {
                    const formattedMenu = [];
                    let totalPrices = 0;
                    let itemCount = 0;

                    if (data.menu) {
                        for (const [type, items] of Object.entries(data.menu as Record<string, any>)) {
                            const filteredItems = Object.keys(items)
                                .filter(name => name !== 'ingredients' && name !== '_id')
                                .map(name => {
                                    totalPrices += parseFloat(items[name].price);
                                    itemCount++;
                                    return {
                                        name,
                                        ...items[name]
                                    };
                                });

                            formattedMenu.push({
                                category: type,
                                items: filteredItems
                            });
                        }
                    }

                    setMenuData(formattedMenu);

                    // Calculate the average price
                    if (itemCount > 0) {
                        const avgPrice = (totalPrices / itemCount).toFixed(2);
                        setAveragePrice(avgPrice);
                    }
                }
            } catch (error) {
                // console.error('Failed to fetch menu:', error);
                setNoMenuMessage('No menu available');
            }
        };

        fetchMenu();
    }, [restaurant._id]);

    const toggleSection = (index: number) => {
        const isActive = activeSections.includes(index);
        setActiveSections(isActive ? activeSections.filter(i => i !== index) : [...activeSections, index]);
    };

    const handleItemPress = (item: MenuItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const openGoogleMaps = (location: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{restaurant.name}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.detail}>Average Price: ${averagePrice || 'N/A'}</Text>
                </View>
                <View style={styles.barcodeContainer}>
                    <Image source={{ uri: restaurant.barcode }} style={styles.barcodeImage} />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => openGoogleMaps(restaurant.location)}>
                    <Text style={styles.buttonText}>Google Maps</Text>
                </TouchableOpacity>
                {noMenuMessage ? (
                    <Text style={styles.noMenuText}>{noMenuMessage}</Text>
                ) : (
                    menuData.map((section, index) => (
                        <View key={index}>
                            <TouchableOpacity onPress={() => toggleSection(index)} style={styles.sectionHeader}>
                                <Text style={styles.sectionHeaderText}>{section.category}</Text>
                                <Icon name={activeSections.includes(index) ? 'chevron-up' : 'chevron-down'} size={24} color="#fff" />
                            </TouchableOpacity>
                            <Collapsible collapsed={!activeSections.includes(index)}>
                                {section.items.map((item: MenuItem, itemIndex: number) => (
                                    <TouchableOpacity key={itemIndex} style={styles.menuItem} onPress={() => handleItemPress(item)}>
                                        <Text style={styles.menuItemText}>{item.name}</Text>
                                        <Text style={styles.menuItemPrice}>${item.price}</Text>
                                    </TouchableOpacity>
                                ))}
                            </Collapsible>
                        </View>
                    ))
                )}
            </ScrollView>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedItem && (
                            <>
                                <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                                <Text style={styles.modalSectionTitle}>Price</Text>
                                <Text style={styles.modalItemDetail}>${selectedItem.price}</Text>
                                <Text style={styles.modalSectionTitle}>Calories</Text>
                                <Text style={styles.modalItemDetail}>{selectedItem.calories}</Text>
                                <Text style={styles.modalSectionTitle}>Description</Text>
                                <Text style={styles.modalItemDetail}>{selectedItem.ingredients}</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <Modal visible={mapModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: restaurant.latitude,
                                longitude: restaurant.longitude
                            }}
                            title={restaurant.name}
                            description={`Average Price: $${averagePrice || 'N/A'}`}
                        />
                    </MapView>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setMapModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#121212',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    detail: {
        fontSize: 18,
        color: '#bbb',
        marginBottom: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#333',
        marginTop: 10,
    },
    sectionHeaderText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    barcodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    barcodeImage: {
        width: 180,
        height: 180,
    },
    button: {
        backgroundColor: '#c65102',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '70%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#444',
        borderBottomWidth: 1,
        borderBottomColor: '#555' 
    },
    noMenuText: {
        color: '#ff6f61',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    mapContainer: {
        flex: 1,
        height: 80,
        width: '80%',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: 300,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    modalContent: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    modalImage: {
        width: 250,
        height: 150,
        borderRadius: 10,
        marginBottom: 20,
    },
    modalItemName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        alignSelf: 'flex-start',
        width: '100%',
        marginBottom: 5,
    },
    modalItemDetail: {
        fontSize: 16,
        color: '#fff',
        alignSelf: 'flex-start',
        width: '100%',
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#c65102',
        padding: 10,
        borderRadius: 5,
        width: '80%',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
    },
    menuItemPrice: {
        color: '#fff',
        marginLeft: 10,
    },
});

export default RestaurantDetail;