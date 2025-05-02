import { Button, View } from "react-native"
import { useClerk } from "@clerk/clerk-expo"
import { useRouter } from "expo-router";
import { api } from "@innobridge/llmclient";
import SecureStore from "expo-secure-store";

const { clearLlmClient } = api;

const Page = () => {
    const { signOut } = useClerk();
    const router = useRouter();
    const onSignOut = async () => {
        try {
            clearLlmClient();
            await SecureStore.deleteItemAsync('llmConfig');
            await signOut();
            // Always redirect regardless of whether state changed
            router.replace('/');
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    }
    
    return (
        <View>
            <Button title="Sign out" onPress={onSignOut} />
        </View>
    )
}

export default Page;