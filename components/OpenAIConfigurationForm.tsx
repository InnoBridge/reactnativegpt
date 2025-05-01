import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import { configuration as config } from '@innobridge/llmclient'
import { defaultStyles } from '@/constants/Styles'

type OpenAIProps = {
    onConfigure: (config: config.LlmConfiguration) => void
}

const OpenAIConfigurationForm: React.FC<OpenAIProps> = ({ onConfigure }) => {
    const [apiKey, setApiKey] = useState('');
    const [organization, setOrganization] = useState('');
  
    const onConfigurationSubmit = () => {
        const llmConfiguration = {
            apiKey: apiKey,
            provider: config.LlmProvider.OPENAI,
        } as config.OpenAIConfiguration;
        
        if (organization !== '') {
            llmConfiguration.organization = organization;
        }
        
        onConfigure(llmConfiguration);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>OpenAI Configuration</Text>
            
            <Text style={styles.label}>API Key:</Text>
            <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="Enter your OpenAI API key"
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
            />

            <Text style={styles.label}>Organization (Optional):</Text>
            <TextInput
                style={styles.input}
                value={organization}
                onChangeText={setOrganization}
                placeholder="Your OpenAI organization ID"
                autoCorrect={false}
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
                onPress={onConfigurationSubmit}>
                <Text style={styles.buttonText}>Save OpenAI Configuration</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 15,
        backgroundColor: Colors.white
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16
    }
});

export default OpenAIConfigurationForm;