import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import Colors from "@/constants/Colors";
import { useState, useEffect } from "react";
import { defaultStyles } from "@/constants/Styles";
import { useRouter, Stack } from "expo-router";
import { useAuth } from '@clerk/clerk-expo';
import HeaderDropDown from "@/components/HeaderDropDown";
import { configuration as config, api } from "@innobridge/llmclient";
import OllamaConfigurationForm from "@/components/OllamaConfigurationForm";
import OpenAIConfigurationForm from "@/components/OpenAIConfigurationForm";
import * as SecureStore from 'expo-secure-store';

const { getLlmProvider, getLlmProviders, createLlmClient, clearLlmClient } = api;

const Page = () => {
    const router = useRouter();
    const { signOut } = useAuth();

    const [llmProvider, setLlmProvider] = useState<config.LlmProvider|null>(null);
    const [llmProviders, setLlmProviders] = useState<config.LlmProvider[]>([]);

    useEffect(() => {
        // Initialize llmProviders when the component mounts
        setLlmProviders(getLlmProviders());
    }, []);

    // Map providers to dropdown items with icons
    const getProviderIcon = (provider: config.LlmProvider) => {
        switch(provider) {
            case config.LlmProvider.OPENAI: return 'ladybug';
            case config.LlmProvider.OLLAMA: return 'fish';
            default: return 'code';
        }
    };

    const handleConfigurationSave = async (configuration: config.LlmConfiguration) => {
        try {
            
            // Wait for client creation to complete
            await createLlmClient(configuration);

            await SecureStore.setItemAsync('llmConfig', JSON.stringify(configuration));
                        
            // Only navigate on success
            router.replace('/(protected)/(drawer)' as any);
        } catch (err) {
            // Handle any errors
            Alert.alert('Failed to create LLM client:' + err);
        }
    };

    const removeClient = async () => {
        clearLlmClient();
        await SecureStore.deleteItemAsync("llmConfig");
        setLlmProvider(null);
        router.replace('/(protected)/(drawer)' as any);
    }

    // Render appropriate configuration form based on provider
    const renderProviderConfig = () => {
        let configComponent = <></>;
        if (getLlmProvider() === null) {
           switch(llmProvider) {
                case config.LlmProvider.OLLAMA:
                    configComponent = <OllamaConfigurationForm onConfigure={handleConfigurationSave} />;
                    break;
                case config.LlmProvider.OPENAI:
                    configComponent =  <OpenAIConfigurationForm onConfigure={handleConfigurationSave} />;
                    break;
                default:
                    configComponent = <Text style={styles.label}>No provider selected.</Text>;
            }
            return (
                <>
                    <Stack.Screen
                        options={{
                            headerTitle: () => (
                                <HeaderDropDown 
                                    title="Please select a LLM provider." 
                                    items={llmProviders.map(provider => ({
                                        key: provider,
                                        title: provider.charAt(0).toUpperCase() + provider.slice(1),
                                        icon: getProviderIcon(provider)
                                    }))}
                                    selected={llmProvider || undefined}
                                    onSelect={(key) => {
                                        // Update the selected provider
                                        setLlmProvider(key as config.LlmProvider);
                                    }}
                                />
                            )
                        }}
                    />
            {configComponent}
            </>
            )
        } else {
            return (
                <>
                <Stack.Screen
                        options={{
                            headerTitle: "You are currently using " + getLlmProvider()
                        }}
                    />
                    <Text>Please remove current LLM Client to change providers.</Text>
                    <TouchableOpacity
                        style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
                        onPress={removeClient}>
                        <Text style={styles.buttonText}>Remove current LLM Client</Text>
                    </TouchableOpacity>
                </>
            )
        }

    };

    return (
        <View style={styles.container}>
  

            {/* Render the appropriate configuration form */}
            {renderProviderConfig()}
                      
            <Button title="Sign Out" onPress={() => signOut()} color={Colors.grey} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    label: {
        fontSize: 18,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: Colors.white
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16
    }
})

export default Page;