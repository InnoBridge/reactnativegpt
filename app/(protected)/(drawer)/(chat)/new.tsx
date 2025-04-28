// export { default } from '@/components/ChatPage';

import { View, KeyboardAvoidingView, Platform, StyleSheet, Image } from "react-native"
import { defaultStyles } from "@/constants/Styles";
import { Stack, Redirect, useRouter } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";
import { useState, useEffect } from 'react';
import MessageInput from "@/components/MessageInput";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/Interfaces";
import Colors from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";
import { useMMKVString } from "react-native-mmkv";
import { keyStorage, storage } from "@/utils/Storage";
import { getLlmProvider } from "@innobridge/llmclient";

const DUMMY_MESSAGES: Message[] = [
    {
        content: 'Hello, how can I help you today?',
        role: Role.Bot,
    },
    {
        content: 'I need help with a React Native issue. My drawer navigation isn\'t working.',
        role: Role.User,
    },
    {
        content: 'I\'d be happy to help with your drawer navigation issue. Could you describe what\'s happening when you try to use it?',
        role: Role.Bot,
    },
    {
        content: 'When I click the hamburger menu, nothing happens. I\'m trying to use DrawerActions.toggleDrawer() but getting an error.',
        role: Role.User,
    },
    {
        content: 'That\'s a common issue with Expo Router and drawer navigation. When using the screenOptions prop, you should use it as a function that receives navigation. Try updating your code to: screenOptions={({ navigation }) => ({ ... })} and then use that navigation object to dispatch the drawer action.',
        role: Role.Bot,
        prompt: 'Provide a helpful solution for React Native drawer navigation issue'
    }
];

const NewChat = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
    const [height, setHeight] = useState(0);

    const [key, setKey] = useMMKVString('apiKey', keyStorage);
    const [organization, setOrganization] = useMMKVString('organization', keyStorage);
    const [gptVersion, setGPTVersion] = useMMKVString('gptVersion', storage);
    
    useEffect(() => {        
        if (getLlmProvider() === null) {
            console.log('No LLM provider set, redirecting to settings');
            router.push("/(protected)/(modal)/settings");
        }
    }, [router]);

    const getCompletion = async (message: string) => {
        console.log('Getting completion for: ', message);
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
                            title="ChatGPT" 
                            items={[
                                { key: '3.5', title: 'GPT-3.5', icon: 'bolt'},
                                { key: '4', title: 'GPT-4', icon: 'sparkles'}
                            ]}
                            selected={gptVersion}
                            onSelect={(key) => {
                                setGPTVersion(key);
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
                <MessageInput onShouldSendMessage={getCompletion} />
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