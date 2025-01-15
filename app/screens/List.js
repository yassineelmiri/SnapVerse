import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase.config';
import { ref, get } from 'firebase/database'; 
import { useNavigation } from '@react-navigation/native';

const CustomAlert = ({ message, onClose }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [fadeAnim, onClose]);

    return (
        <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
            <Text style={styles.alertText}>{message}</Text>
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.alertClose}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const List = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const adsRef = ref(FIREBASE_DB, 'advertisements');
                const snapshot = await get(adsRef);
                if (snapshot.exists()) {
                    const adsData = [];
                    snapshot.forEach((childSnapshot) => {
                        adsData.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val(),
                        });
                    });
                    setAdvertisements(adsData);
                } else {
                    console.log('No advertisements found!');
                }
            } catch (error) {
                console.error('Failed to fetch advertisements:', error);
                alert('Failed to fetch advertisements: ' + error.message);
            }
        };

        fetchAdvertisements();
    }, []);

    const handleSignOut = async () => {
        try {
            await FIREBASE_AUTH.signOut();
            setAlertMessage('You have been logged out!');
        } catch (error) {
            console.error('Logout failed:', error);
            setAlertMessage('Failed to log out: ' + error.message);
        }
    };

    const renderAd = ({ item }) => (
        <View style={styles.adContainer}>
            <Image source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/test.webp')} style={styles.adImage} />
            <Text style={styles.adDescription}>{item.description}</Text>
            <Text style={styles.adLikesTitle}>Liked by:</Text>
            <FlatList
                horizontal
                data={item.likedBy || []}
                keyExtractor={(userId) => userId}
                renderItem={({ item: userId }) => (
                    <Image
                        source={{ uri: `https://firebasestorage.googleapis.com/v0/b/<your-bucket>/o/profiles%2F${userId}.jpg?alt=media` }}
                        style={styles.userPhoto}
                    />
                )}
            />
            <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Detail', { adId: item.id })}
                >
                <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>
            {alertMessage ? (
                <CustomAlert
                    message={alertMessage}
                    onClose={() => setAlertMessage('')}
                />
            ) : null}
            <FlatList
                data={advertisements}
                keyExtractor={(item) => item.id}
                renderItem={renderAd}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddAdvertisement')}
            >
                <Text style={styles.addButtonText}>Add Advertisement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    adContainer: {
        marginBottom: 16,
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        padding: 16,
    },
    adImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'red',
    },
    adDescription: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 8,
    },
    adLikesTitle: {
        color: '#bbb',
        fontSize: 14,
        marginTop: 8,
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    detailsButton: {
        backgroundColor: '#673AB7',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    detailsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#9C27B0',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#E91E63',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    alertContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
    },
    alertText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    alertClose: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 16,
    },
});
