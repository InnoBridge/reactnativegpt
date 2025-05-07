import { 
    View, 
    KeyboardAvoidingView, 
    Platform, 
    StyleSheet, 
    Image, 
    Alert,
    Text
} from "react-native";
import { useState, useCallback } from "react";
import { defaultStyles } from "@/constants/Styles";
import HeaderDropDown from "@/components/HeaderDropDown";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import { model, api, configuration, enums, generateImageRequest } from "@innobridge/llmclient";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import { ChatMessageProps } from "@/components/ChatMessage";
import { useFocusEffect } from '@react-navigation/native';

const { getLlmProvider, getModel, getModels, setModel } = api;
const { LlmProvider } = configuration;

const initialMessages: ChatMessageProps[] = [
    {
        content: "Welcome to DALL-E! What would you like to create?",
        role: enums.Role.SYSTEM,
        loading: false,
        imageUrl: "https://galaxies.dev/img/meerkat_2.jpg",
        prompt: "A meerkat in a desert",
    }
];

const Page = () => {
    const router = useRouter();
    const [height, setHeight] = useState(0);
    const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
    const [llmProvider, setLlmProvider] = useState('');
    const [llmModels, setLlmModels] = useState<model.Model[]>([]);
    const [currentModel, setCurrentModel] = useState< model.Model | undefined>(undefined);
    const [callingImageModel, setCallingImageModel] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const provider = getLlmProvider();
            if (provider !== LlmProvider.OPENAI) {
                console.log('Llm provider not OpenAI, redirecting to settings');
                router.replace("/(protected)/(modal)/settings");
            } else {
                setLlmProvider(provider);
                const model = getModel();
                setCurrentModel(model === null ? undefined : model);
                const validModels = ["dall-e-3", "dall-e-2", "gpt-image-1"];
                getModels().then((models) => {
                    setLlmModels(models.data.filter((model) => validModels.includes(model.id)));
                });
            }
        }, [])
    );

    const getLlmModels = llmModels.map((model: model.Model) => {
        return {
            key: model.id,
            title: model.id,
            icon: currentModel && model.id === currentModel.id ? "checkmark" : "sparkles"
        };
    });

    const onLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
    };

    const generateImage = async (message: string) => {
        if (callingImageModel) return;
        if (getModel() === null) {
            Alert.alert('Error', 'No model set. Please set the model before sending a message.');
            return;
        }
        if (messages.length === 0) {
            // Create chat later, store to DB
        }
        setCallingImageModel(true);

        const updatedMessages: ChatMessageProps[] = [
            ...messages, 
            { content: message, role: enums.Role.USER, loading: false },
            { content: "Generating image...", role: enums.Role.SYSTEM, loading: true }
        ];

        setMessages(updatedMessages);

        const chatRequest: generateImageRequest.GenerateImageRequest = {
            model: currentModel?.id,
            prompt: message,
            n: 1,
            size: enums.ImageSize.SIZE_256x256,
            response_format: enums.ImageFormat.URL
        }
        try {

            const response = await api.generateImage(chatRequest);
            if (response.data.length > 0) {
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1), // Remove the loading message
                    { 
                        content: "here is your message", 
                        role: enums.Role.SYSTEM,
                        imageUrl: response.data[0].url,
                        loading: false
                    }
                ]);
            } else {
                Alert.alert('Error', 'No image generated. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to generate image. Please try again.');
        } finally {
            setCallingImageModel(false);
        }
    };
    
    return (
        <View style={defaultStyles.pageContainer}>
            <Stack.Screen 
                options={{
                    headerTitle: () => (
                        <HeaderDropDown
                            title={`Dalle-E ${llmProvider}`}
                            selected={currentModel && currentModel.id}
                            onSelect={(key) => {
                                const model = llmModels.find((model) => model.id === key);
                                if (model) {
                                    setModel(model);
                                    setCurrentModel(model);
                                }                            
                            }}
                            items={getLlmModels}
                        />
                    )
                }}
            />
            <View style={{ flex: 1 }} onLayout={onLayout}>
                {messages.length === 0 && (
                    <View style={[{ marginTop: height / 2 - 100, alignItems: "center", gap: 16 }]}>
                    <View style={[styles.logoContainer]}>
                        <Image source={require('@/assets/images/dalle.png')} style={styles.image} />
                    </View>
                    <Text style={styles.label}>Let me turn your imagination into imagery.</Text>
                    </View>
                )}
                <FlashList
                    data={messages}
                    renderItem={({ item }) => <ChatMessage {...item} />}
                    estimatedItemSize={400}
                    contentContainerStyle={{
                        paddingBottom: 150,
                        paddingTop: 30
                    }}
                    keyboardDismissMode="on-drag"
                />
            </View>
            <KeyboardAvoidingView 
                keyboardVerticalOffset={70}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%'
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            >
                <MessageInput 
                    disabled={callingImageModel}
                    onShouldSendMessage={generateImage} 
                />
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    logoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        backgroundColor: Colors.black,
        borderRadius: 50,
        overflow: 'hidden',
        borderBlockColor: Colors.greyLight,
        borderWidth: 1,
    },
    image: {
        resizeMode: 'cover'
    },
    label: {
        fontSize: 16,
        color: Colors.grey
    }
});

export default Page;