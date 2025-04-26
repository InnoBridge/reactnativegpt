import { Button, View } from "react-native"
import { useClerk } from "@clerk/clerk-expo"
import { useRouter } from "expo-router";

const Page = () => {
    const { signOut } = useClerk();
    const router = useRouter();
    const onSignOut = async () => {
        try {
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