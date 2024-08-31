import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    name: string;
    email: string;
    company: {
        name: string;
    };
}

interface AuthResponse {
    error: boolean;
    message: string;
    user?: User;
    token?: string;
    pinnedRestaurants?: string[];
}

interface AuthState {
    token: string | null;
    authenticated: boolean;
    user: User | null;
    pinnedRestaurants: string[];
}

interface AuthContextType {
    authState: AuthState;
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
    setLoading: (loading: boolean) => void;
    loading: boolean;
    onRegister: (firstName: string, lastName: string, email: string, company: string, invitation: string, password: string) => Promise<AuthResponse>;
    onLogin: (email: string, password: string) => Promise<AuthResponse>;
    onLogout: () => Promise<void>;
    onUserPasswordUpdate: (currentPassword: string, newPassword: string) => Promise<AuthResponse>;
    togglePin: (restaurantId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({ 
        token: null, 
        authenticated: false, 
        user: null, 
        pinnedRestaurants: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedAuthState = await AsyncStorage.getItem('authState');
            if (storedAuthState) {
                const state = JSON.parse(storedAuthState);
                setAuthState(state);
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const togglePin = async (restaurantId: string) => {
        try {
            let newPinned = [...(authState.pinnedRestaurants || [])];
            if (newPinned.includes(restaurantId)) {
                newPinned = newPinned.filter(id => id !== restaurantId);
                console.log(restaurantId, 'has been unpinned from favorites');
            } else if (newPinned.length < 2) {
                newPinned.push(restaurantId);
                console.log(restaurantId, 'has been pinned into favorites');
            } else {
                Alert.alert(
                    'Pin Limit Reached',
                    'You can only pin up to 2 restaurants.',
                    [{ text: 'OK' }],
                    { cancelable: true }
                );
                return;
            }
    
            await AsyncStorage.setItem('authState', JSON.stringify({ ...authState, pinnedRestaurants: newPinned }));
            setAuthState(prevState => ({ ...prevState, pinnedRestaurants: newPinned }));
    
            await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/update-favorites`, {
                userId: authState.user?.id,
                restaurantIds: newPinned
            });
        } catch (error) {
            console.log('Failed to update favorites:', error);
        }
    };
    
    const onRegister = async (
        firstName: string, 
        lastName: string, 
        email: string, 
        company: string, 
        invitation: string, 
        password: string
    ): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/register`, {
                firstName,
                lastName,
                email,
                company,
                invitation,
                password,
            });
    
            if (response.data && response.data.user) {
                return { 
                    error: false, 
                    message: 'Registration successful.', 
                    user: response.data.user 
                };
            } else {
                return { 
                    error: true, 
                    message: 'Registration failed.' 
                };
            }
        } catch (error) {
            console.log('Registration error:', error);
            return { 
                error: true, 
                message: 'Registration failed. Please try again.' 
            };
        }
    };

    const onLogin = async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/auth`, { email, password });
            if (response.data && response.data.token) {
                const { token, user, pinnedRestaurants } = response.data;
    
                // // Fetch pinned restaurants on login
                // const pinnedRestaurantsResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/users/get-pinned-restaurants/${user.id}`);
                
                const newState = {
                    token,
                    authenticated: true,
                    user: {
                        ...user,
                        name: `${user.firstName} ${user.lastName}`,
                        company: user.company
                    },
                    pinnedRestaurants: pinnedRestaurants || []
                };
                console.log('newState:', newState);
                // Save state in AsyncStorage
                await AsyncStorage.setItem('authState', JSON.stringify(newState));
                setAuthState(newState);
                return { error: false, message: "Login successful", user, token, pinnedRestaurants };
            }
            return { error: true, message: "Login failed" };
        } catch (error) {
            console.log('Login failed:', error);
            return { error: true, message: 'Login failed' };
        }
    };

    const onUserPasswordUpdate = async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
        if (!authState.user) {
            return { error: true, message: "No user is currently logged in." };
        }
    
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/update-password`, {
                userId: authState.user.id,
                email: authState.user.email,
                currentPassword: currentPassword,
                newPassword: newPassword
            });
    
            if (response.data && response.status === 200) {
                await onLogout();
                return { error: false, message: response.data.message };
            } else {
                return { error: true, message: response.data.message };
            }
        } catch (error) {
            console.log('Password update failed:', error);
            return { error: true, message: 'Password update failed' };
        }
    };

    const onLogout = async () => {
        await AsyncStorage.removeItem('authState');
        setAuthState(prevState => ({ 
            token: null, 
            authenticated: false, 
            user: null, 
            pinnedRestaurants: prevState.pinnedRestaurants
        }));
    };

    return (
        <AuthContext.Provider value={{ authState, setAuthState, setLoading, loading, onRegister, onLogin, onLogout, onUserPasswordUpdate, togglePin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


export default AuthProvider;