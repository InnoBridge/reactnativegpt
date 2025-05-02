import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { defaultStyles } from "@/constants/Styles";
import HeaderDropDown from "@/components/HeaderDropDown";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { model, api, requestMessage, configuration } from "@innobridge/llmclient";

const { getLlmProvider, getModel, getModels, setModel } = api;
const { LlmProvider } = configuration;

const Page = () => {
    const router = useRouter();
    const [height, setHeight] = useState(0);
    const [messsages, setMessages] = useState<requestMessage.Message[]>([]);
    const [working, setWorking] = useState(false);
    const [llmProvider, setLlmProvider] = useState('');
    const [llmModels, setLlmModels] = useState<model.Model[]>([]);
    const [currentModel, setCurrentModel] = useState< model.Model | undefined>(undefined);

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
    
    return (
        <View style={defaultStyles.pageContainer}>
            <Stack.Screen 
                options={{
                    headerTitle: () => (
                        <HeaderDropDown
                            title="Dalle-E"
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