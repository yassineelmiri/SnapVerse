import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FIREBASE_DB } from '../../Firebase.config'; 
import { ref, get } from 'firebase/database';

const Details = () => {
    const route = useRoute();
    const { adId } = route.params; 
    const [adDetails, setAdDetails] = useState(null);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                const adRef = ref(FIREBASE_DB, `advertisements/${adId}`);
                const snapshot = await get(adRef);
                if (snapshot.exists()) {
                    setAdDetails(snapshot.val());
                } else {
                    console.log('No details found for this ad');
                }
            } catch (error) {
                console.error('Failed to fetch ad details:', error);
            }
        };

        fetchAdDetails();
    }, [adId]);

    if (!adDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: adDetails.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{adDetails.title || 'No Title'}</Text>
            <Text style={styles.description}>{adDetails.description || 'No Description'}</Text>
            <Text style={styles.likedBy}>Liked by: {adDetails.likedBy?.join(', ') || 'No likes yet'}</Text>
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    description: {
        color: '#bbb',
        fontSize: 16,
        marginBottom: 8,
    },
    likedBy: {
        color: '#673AB7',
        fontSize: 14,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});
