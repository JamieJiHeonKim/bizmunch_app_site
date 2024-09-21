import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, Dimensions, Linking, ActivityIndicator, Animated } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
// import MapView, { Marker } from 'react-native-maps';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const { width: viewportWidth } = Dimensions.get('window');

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
    description: string;
    discount: boolean;
    barcode: string;
    image: string;
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
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef<any>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/restaurant/${restaurant._id}/menu`);
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
                                .filter(name => name !== 'description' && name !== '_id')
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

                    if (itemCount > 0) {
                        const avgPrice = (totalPrices / itemCount).toFixed(2);
                        setAveragePrice(avgPrice);
                    }
                }
            } catch (error) {
                setNoMenuMessage('No menu available');
            } finally {
                setLoading(false);
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

    const flipToShowBarcode = () => {
        setIsFlipped(!isFlipped);
        Animated.timing(flipAnimation, {
            toValue: isFlipped ? 0 : 180,
            duration: 600,
            useNativeDriver: true,
        }).start();
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const filteredItems = menuData.flatMap(section => section.items).filter((item: MenuItem) => item.barcode && item.discount);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{restaurant.name}</Text>
                </View>
                <View style={styles.barcodeContainer}>
                    <View style={styles.indicatorContainer}>
                        <Icon name="rotate-right" size={24} color="#fff" />
                        <Text style={styles.indicatorText}>Tap to View Barcode</Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#ff6f61" />
                    ) : filteredItems.length > 0 ? (
                        <Carousel
                            ref={carouselRef}
                            data={filteredItems}
                            width={viewportWidth}
                            height={400}
                            loop={true}
                            autoPlay={false}
                            scrollAnimationDuration={300}
                            renderItem={({ item }) => (
                                <View style={styles.carouselItem}>
                                    <TouchableOpacity onPress={flipToShowBarcode} style={styles.imageContainer}>
                                        {!isFlipped ? (
                                            <Animated.View style={[styles.flipCard, { transform: [{ rotateY: frontInterpolate }] }]}>
                                                <Image source={{ uri: item.image }} style={styles.carouselImage} />
                                            </Animated.View>
                                        ) : null}

                                        {isFlipped ? (
                                            <Animated.View
                                                style={[styles.flipCard, styles.flipCardBack, { transform: [{ rotateY: backInterpolate }] }]}
                                            >
                                                <Image source={{ uri: item.barcode }} style={styles.carouselImage} />
                                            </Animated.View>
                                        ) : null}
                                    </TouchableOpacity>
                                    <Text style={styles.carouselItemText}>{item.name}</Text>
                                    <Text style={styles.carouselItemText}>Price: ${item.price}</Text>
                                    <Text style={styles.carouselItemText}>Calories: {item.calories}</Text>
                                </View>
                            )}
                            onSnapToItem={(index) => setCurrentIndex(index)}
                        />
                    ) : (
                        <Text style={styles.noBarcodeText}>No barcodes available</Text>
                    )}
                </View>
                <View style={styles.dotsContainer}>
                    {filteredItems.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
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
                                {selectedItem.image ? (
                                    <Image source={{ uri: selectedItem.image }} style={styles.imageImage} />
                                ) : (
                                    <Text style={styles.noImageText}>No image available</Text>
                                )}
                                <Text style={styles.modalSectionTitle}>Price</Text>
                                <Text style={styles.modalItemDetail}>${selectedItem.price}</Text>
                                <Text style={styles.modalSectionTitle}>Calories</Text>
                                <Text style={styles.modalItemDetail}>{selectedItem.calories}</Text>
                                <Text style={styles.modalSectionTitle}>Description</Text>
                                <Text style={styles.modalItemDetail}>{selectedItem.description}</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
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
        position: 'relative',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    infoContainer: {
        alignItems: 'center',
    },
    detail: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
        fontWeight: 'light'
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
    subHeader: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginVertical: 5,
    },
    barcodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        padding: 10  
    },
    barcodeImage: {
        width: 180,
        height: 180,
        marginBottom: 10,
    },
    imageImage: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#b57602',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '50%',
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
        height: 300,
        width: '90%',
        marginBottom: 20,
    },
    map: {
        width: '90%',
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
        backgroundColor: '#b57602',
        padding: 10,
        borderRadius: 5,
        width: '50%',
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
    noBarcodeText: {
        fontSize: 14,
        color: '#ff6f61',
        textAlign: 'center',
        marginVertical: 8,
        paddingHorizontal: 10,
        fontStyle: 'italic',
    },
    carouselItem: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    carouselItemText: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 5,
    },
    noImageText: {
        fontSize: 16,
        color: '#ff6f61',
        textAlign: 'center',
        marginVertical: 10,
        fontStyle: 'italic',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        marginBottom: 10,
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    pageIndexText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    carouselWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column'
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#b57602',
    },
    inactiveDot: {
        backgroundColor: '#e3e3e3',
    },
    flipCard: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipCardBack: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    indicatorText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 5,
    },
});

export default RestaurantDetail;