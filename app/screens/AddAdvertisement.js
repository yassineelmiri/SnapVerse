import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../Firebase.config';
import { ref, set } from 'firebase/database';

const AddAdvertisement = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            } else {
                alert('Image picking was canceled or failed.');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Error picking image: ' + error.message);
        }
    };

    const handleUpload = async () => {
        if (!image || !description) {
            alert('Please provide an image and a description!');
            return;
        }

        setUploading(true);

        try {
            const userId = FIREBASE_AUTH.currentUser.uid;

            // Convertir l'image en base64
            const base64data = await FileSystem.readAsStringAsync(image, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Créer la référence dans la base de données
            const adRef = ref(FIREBASE_DB, 'advertisements/' + Date.now());

            // Sauvegarder dans Realtime Database
            await set(adRef, {
                userId,
                description,
                imageBase64: base64data,
                createdAt: new Date(),
            });

            alert('Advertisement added successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to upload advertisement:', error);
            alert('Failed to upload advertisement. Error: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Pick an image</Text>
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Add a description"
                placeholderTextColor="#bbb"
                value={description}
                onChangeText={setDescription}
            />
            <Button
                title={uploading ? "Uploading..." : "Submit"}
                onPress={handleUpload}
                disabled={uploading}
            />
        </View>
    );
};

export default AddAdvertisement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#1f1f1f',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imagePlaceholder: {
        color: '#bbb',
        fontSize: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 16,
        color: '#fff',
        marginBottom: 16,
    },
});
