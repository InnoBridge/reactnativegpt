import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
    Text,
    TextInput,
    View, 
    StyleSheet, 
    KeyboardAvoidingView, 
    Image,
    Platform, 
    ActivityIndicator, 
    TouchableOpacity,
    Alert} from "react-native"
import React, { useState } from "react";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";

const Login = () => {
    const { type } = useLocalSearchParams<{ type: string }>();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { signUp, isLoaded: signUpLoaded, setActive: signUpSetActive } = useSignUp();

    const [loading, setLoading] = useState(false);
    const [emailAddress, setEmailAddress] = useState('innobridgetechnology@gmail.com');
    const [password, setPassword] = useState('');

    const onLoginPress = async() => {
        if (!isLoaded) return;

        setLoading(true);
        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password
            });
            
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            Alert.alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    const onSignUpPress = async() => {
        if (!signUpLoaded) return;
        setLoading(true);

        try {
            // Create the user on Clerk
            const result = await signUp.create({
                emailAddress,
                password
            });

            // this indicates the user is signed in
            signUpSetActive({ session: result.createdSessionId });
        } catch (err: any) {
            alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={1}
            style={styles.container}
        >
            {loading && (
                <View style={defaultStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.white} />
                </View>
            )}
            <Image 
                source={require('../assets/images/logo-dark.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>
                {type === 'login' ? 'Welcome back' : 'Create your account'}
            </Text>

            <View style={{ marginBottom: 30 }}>
                <TextInput style={styles.inputField}
                    autoCapitalize="none"
                    placeholder="Email"
                    value={emailAddress}
                    onChangeText={setEmailAddress} />
                <TextInput style={styles.inputField}
                    autoCapitalize="none"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry />
            </View>
            
            
            {type === 'login' ? (
                <>
                    <TouchableOpacity style={[defaultStyles.btn, styles.btnPrimary]} onPress={onLoginPress}>
                        <Text style={styles.btnPrimaryText}>Login</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity style={[defaultStyles.btn, styles.btnPrimary]} onPress={onSignUpPress}>
                    <Text style={styles.btnPrimaryText}>Create account</Text>
                </TouchableOpacity>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    logo: {
        width: 60,
        height: 60,
        alignSelf: 'center',
        marginVertical: 80
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    inputField: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 12,
        padding: 10,
        backgroundColor: Colors.white
    },
    btnPrimary: {
        backgroundColor: Colors.primary,
        marginVertical: 4
    },
    btnPrimaryText: {
        color: Colors.white,
        fontSize: 16
    }
})

export default Login;