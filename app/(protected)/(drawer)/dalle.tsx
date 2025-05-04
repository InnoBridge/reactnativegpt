import { View, KeyboardAvoidingView, Platform, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { defaultStyles } from "@/constants/Styles";
import HeaderDropDown from "@/components/HeaderDropDown";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import { model, api, requestMessage, configuration } from "@innobridge/llmclient";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";

const { getLlmProvider, getModel, getModels, setModel } = api;
const { LlmProvider } = configuration;

const Page = () => {
    const router = useRouter();
    const [height, setHeight] = useState(0);
    const [messages, setMessages] = useState<requestMessage.Message[]>([]);
    const [working, setWorking] = useState(false);
    const [llmProvider, setLlmProvider] = useState('');
    const [llmModels, setLlmModels] = useState<model.Model[]>([]);
    const [currentModel, setCurrentModel] = useState< model.Model | undefined>(undefined);
    const [callingLlm, setCallingLlm] = useState(false);

    useEffect(() => {
        const provider = getLlmProvider();
        if (provider !== LlmProvider.OPENAI) {
            console.log('Llm provider not OpenAI, redirecting to settings');
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
                {/* {messages.length === 0 && (
                    <MessageIdeas onSelectCard={getCompletion} />
                )} */}
                {/* <MessageInput 
                    disabled={callingLlm}
                    onShouldSendMessage={getCompletion} 
                /> */}
            </KeyboardAvoidingView>
        </View>
    )
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

export default Page;