// export { default } from '@/components/ChatPage';

import { View, KeyboardAvoidingView, Platform, StyleSheet, Image, Alert } from "react-native"
import { defaultStyles } from "@/constants/Styles";
import { Stack, useRouter } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";
import { useState, useEffect } from 'react';
import MessageInput from "@/components/MessageInput";
import MessageIdeas from "@/components/MessageIdeas";
import Colors from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";
import { api, model, chatRequest, enums, requestMessage, responseMessage } from "@innobridge/llmclient";
const { getLlmProvider, getModels, getModel, setModel, createCompletion } = api;
const { Role } = enums;

const NewChat = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<requestMessage.Message[]>([]);
    const [height, setHeight] = useState(0);
    const [llmProvider, setLlmProvider] = useState('');
    const [llmModels, setLlmModels] = useState<model.Model[]>([]);
    const [currentModel, setCurrentModel] = useState<model.Model | undefined>(undefined);
    const [callingLlm, setCallingLlm] = useState(false);

    useEffect(() => {
        const provider = getLlmProvider();
        if (provider === null) {
            console.log('No LLM provider set, redirecting to settings');
            router.push("/(protected)/(modal)/settings");
        } else {
            setLlmProvider(provider);
            const model = getModel();
            setCurrentModel(model === null ? undefined : model);
            getModels().then((models) => {
                setLlmModels(models.data);
            });
        }
    }, [router]);

    const getLlmModels = llmModels.map((model: model.Model) => {
        return {
            key: model.id,
            title: model.id,
            icon: currentModel && model.id === currentModel.id ? "checkmark" : "sparkles"
        };
    });

    const getCompletion = async (message: string) => {
        if (callingLlm) {
            return;
        }
        if (getModel() === null) {
            Alert.alert('Error', 'No model set. Please set the model before sending a message.');
            return;
        }
        if (messages.length === 0) {
            // Create chat later, store to DB
        }
        setCallingLlm(true);

        const updatedMessages: requestMessage.Message[] = [
            ...messages, 
            { content: message, role: Role.USER }
        ];

        setMessages(updatedMessages);
        const chatRequest: chatRequest.ChatRequest = {
            messages: updatedMessages,        
        };
        try {
            const response = await createCompletion(chatRequest);
            setMessages(prevMessages => [
                ...prevMessages,
                { content: response.choices[0].message.content as string, role: Role.BOT }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to get completion: ' + error);
        } finally {
            setCallingLlm(false);
        }
    };

    const onLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
    };

    return (
        <View style={defaultStyles.pageContainer}>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <HeaderDropDown 
                            title={llmProvider} 
                            items={getLlmModels}
                            selected={currentModel && currentModel.id}
                            onSelect={(key) => {
                                const model = llmModels.find((model) => model.id === key);
                                if (model) {
                                    setModel(model);
                                    setCurrentModel(model);
                                }
                            }}
                        />
                    )
                }}
            />
            <View style={{ flex: 1 }} onLayout={onLayout}>
                {messages.length === 0 && (
                    <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
                        <Image source={require('@/assets/images/logo-white.png')} style={styles.image} />
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
                {messages.length === 0 && (
                    <MessageIdeas onSelectCard={getCompletion} />
                )}
                <MessageInput 
                    disabled={callingLlm}
                    onShouldSendMessage={getCompletion} 
                />
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: Colors.black,
        borderRadius: 50
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'cover'
    }
});

export default NewChat;