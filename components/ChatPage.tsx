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
import { api, model, chatRequest, enums, requestMessage, chatCompletion } from "@innobridge/llmclient";
import { fetch } from 'expo/fetch';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite'
import { addChat, addMessage, getMessages } from '@/utils/Database';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

const { getLlmProvider, getModels, getModel, setModel, reactNativeStreamingCompletion } = api;
const { Role } = enums;

const NewChat = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<requestMessage.Message[]>([]);
    const [height, setHeight] = useState(0);
    const [llmProvider, setLlmProvider] = useState('');
    const [llmModels, setLlmModels] = useState<model.Model[]>([]);
    const [currentModel, setCurrentModel] = useState<model.Model | undefined>(undefined);
    const [callingLlm, setCallingLlm] = useState(false);
    const [chatId, setChatId] = useState<number | null>(null);

    console.log(FileSystem.documentDirectory)

    const { id } = useLocalSearchParams<{
            id?: string;
    }>();

    const db = useSQLiteContext();

    useEffect(() => {
        (async () => {
            setChatId(Number(id));
            const messages = await getMessages(db, Number(id));
            setMessages(messages);
        })();
    }, [id, router]);

    useFocusEffect(
        useCallback(() => {
            ( async() => {
                console.log(id)

            const provider = getLlmProvider();
            if (provider === null) {
                router.replace("/(protected)/(modal)/settings");
                return;
            }
            setLlmProvider(provider);
            const model = getModel();
            setCurrentModel(model === null ? undefined : model);
            getModels().then((models) => {
                setLlmModels(models.data);
            });
            setChatId(Number(id));
            const messages = await getMessages(db, Number(id));
            setMessages(messages);
    })()}, [router])
    );

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
        let id = chatId;
        if (!chatId) {
            await addChat(db, message)
                .then(result => {   
                    setChatId(result.lastInsertRowId);
                    id = result.lastInsertRowId;});
        }
        setCallingLlm(true);

        const updatedMessages: requestMessage.Message[] = [
            ...messages, 
            { content: message, role: Role.USER }
        ];

        setMessages(updatedMessages);
        addMessage(db, id!, {content: message, role: Role.USER});
        const chatRequest: chatRequest.ChatRequest = {
            messages: updatedMessages,
            stream: true   
        };

        try {
            // Track streaming response outside React state
            let streamedContent = '';

            setMessages(prevMessages => [
                ...prevMessages,
                { content: "", role: Role.SYSTEM }
            ]);
            const listener = (completions: Array<chatCompletion.ChatCompletion>) => {
                const chunk = (completions[0].choices[0] as chatCompletion.CompletionChunk).delta.content;
                if (chunk === null) return;
                streamedContent += chunk;

                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === Role.SYSTEM) {
                        lastMessage.content += chunk;
                    }
                    return newMessages;
                    }
                );
            }
            await reactNativeStreamingCompletion(chatRequest, fetch as unknown as typeof globalThis.fetch, listener);
            const result = await addMessage(db, id!, {
                content: streamedContent, role: Role.SYSTEM
            });
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
                            title={`Chat ${llmProvider}`} 
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