import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import { LlmConfiguration, LlmProvider, OllamaConfiguration } from '@innobridge/llmclient'
import { defaultStyles } from '@/constants/Styles'

type OllamaProps = {
    onConfigure: (config: LlmConfiguration) => void
}

const OllamaConfigurationForm: React.FC<OllamaProps> = ({ onConfigure }) => {
    const [baseURL, setBaseURL] = useState('http://localhost:11434');
    const [apiKey, setApiKey] = useState('');
    const [organization, setOrganization] = useState('');
  
    const onConfigurationSubmit = () => {
        const llmConfiguration = {
            baseURL: baseURL,
            provider: LlmProvider.OLLAMA,
        } as OllamaConfiguration;
        if (apiKey !== '') {
            llmConfiguration.apiKey = apiKey;
        } 
        if (organization !== '') {
            llmConfiguration.organization = organization;
        }
        onConfigure(llmConfiguration);
    }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ollama Configuration</Text>
      
      <Text style={styles.label}>Base URL:</Text>
      <TextInput
        style={styles.input}
        value={baseURL}
        onChangeText={setBaseURL}
        placeholder="Enter Ollama server URL (e.g. http://localhost:11434)"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Text style={styles.label}>API Key (Optional):</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="Enter API key if required"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Organization (Optional):</Text>
      <TextInput
        style={styles.input}
        value={organization}
        onChangeText={setOrganization}
        placeholder="Your organization if required"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
        onPress={onConfigurationSubmit}>
        <Text style={styles.buttonText}>Save Ollama Configuration</Text>
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

export default OllamaConfigurationForm;