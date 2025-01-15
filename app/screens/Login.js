import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../../Firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const CustomAlert = ({ message, type, onClose }) => {
    const backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';
    const fadeAnim = new Animated.Value(0);

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [fadeAnim, onClose]);

    return (
        <Animated.View style={[styles.alert, { backgroundColor, opacity: fadeAnim }]}>
            <Text style={styles.alertText}>{message}</Text>
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.alertClose}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const scaleValue = new Animated.Value(1);

    const auth = FIREBASE_AUTH;

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const signIn = async () => {
        animateButton();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setAlert({ message: 'Signed in successfully!', type: 'success' });
        } catch (error) {
            setAlert({ message: `Sign in failed: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        animateButton();
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setAlert({ message: 'Account created successfully!', type: 'success' });
        } catch (error) {
            setAlert({ message: `Sign up failed: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {alert && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <KeyboardAvoidingView behavior="padding">
                <Text style={styles.title}>Welcome Back</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#9C27B0" />
                ) : (
                    <>
                        <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleValue }] }]}>
                            <TouchableOpacity style={styles.button} onPress={signIn}>
                                <MaterialIcons name="login" size={24} color="#fff" />
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleValue }] }]}>
                            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={signUp}>
                                <MaterialIcons name="person-add" size={24} color="#fff" />
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#1E1E1E',
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
    },
    animatedButton: {
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9C27B0',
        padding: 15,
        borderRadius: 8,
    },
    secondaryButton: {
        backgroundColor: '#673AB7',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    alert: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 8,
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
