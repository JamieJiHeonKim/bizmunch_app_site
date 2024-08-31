import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator, NavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from '../screens/Home';
import Login from '../screens/Login';
import UserSettings from '../screens/UserSettings';
// import UserData from '../screens/UserData';
import logoIcon from '../../assets/bizmunch-icon-white.png';
import DropdownMenu from './DropdownMenu';
import { useAuth } from '../context/AuthContext';
import VerifyEmail from '../screens/VerifyEmail';
import Register from '../screens/Register';
import RestaurantDetails from '../screens/RestaurantDetails';
import RestaurantList from '../screens/RestaurantList';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    UserSettings: undefined;
    // UserData: undefined;
    RestaurantList: undefined;
    RestaurantDetails: { restaurant: any }
    VerifyEmail: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { onLogout } = useAuth();

    const actions = {
        signOut: () => {
            onLogout();
            navigation.navigate('Login');
        },
        settings: () => navigation.navigate('UserSettings'),
        // data: () => navigation.navigate('UserData')
    };

    const handleMenuSelection = (key: string) => {
        if (key in actions) {
            const action = actions[key as keyof typeof actions];
            action();
        }
    };

    return (
        <Stack.Navigator
            screenOptions={({ navigation }: { navigation: any }) => ({
                headerRight: () => <DropdownMenu onOptionSelect={handleMenuSelection} />,
                headerTitle: () => <Image source={logoIcon} style={styles.logo} resizeMode="contain" />,
                headerTitleAlign: 'center',
                headerBackVisible: false,
                headerLeft: () => (
                navigation.canGoBack() && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={25} color="#fff" />
                    </TouchableOpacity>
                )
            ),
            headerStyle: {
            backgroundColor: '#121212',
            },
            headerTintColor: '#fff',
        })}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            {/* <Stack.Screen name="UserData" component={UserData} /> */}
            <Stack.Screen name="RestaurantList" component={RestaurantList} />
            <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 50,
    }
});

export default AppNavigator;