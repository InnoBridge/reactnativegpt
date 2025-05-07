import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@innobridge/llmclient';

const { getLlmProvider } = api;

const layout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(modal)/settings" 
                options={{
                    headerTitle: 'Settings',
                    presentation: 'modal',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.selected },
                    headerRight: () => (
                        <TouchableOpacity 
                        onPress={() => {
                            if (getLlmProvider() === null) {
                                return Alert.alert('No LLM client found, please configure one first');
                            }
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(protected)/(drawer)/(chat)/new' as any);
                            }
                        }}
                        style={{ 
                            backgroundColor: Colors.greyLight,
                            borderRadius: 20,
                            padding: 6
                        }}
                        >
                            <Ionicons name="close-outline" size={24} color={Colors.grey} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen
                name="(modal)/[url]" 
                options={{
                    headerTitle: '', // This turn header title from (modal)/[url] to ""
                    presentation: 'fullScreenModal',
                    headerBlurEffect: 'dark',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: 'rgba(0,0,0,0.4)' },
                    headerTransparent: true,
                    headerLeft: () => (
                        <TouchableOpacity 
                        onPress={() => {
                            router.replace('/(protected)/(drawer)/dalle' as any);
                        }}
                        style={{ 
                            backgroundColor: Colors.greyLight,
                            borderRadius: 20,
                            padding: 4
                        }}
                        >
                            <Ionicons name="close-outline" size={24} color={Colors.grey} />
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    );
};

export default layout;