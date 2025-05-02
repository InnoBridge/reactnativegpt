import { View, StyleSheet } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import HeaderDropDown from "@/components/HeaderDropDown";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";

const Page = () => {
    return (
        <View style={defaultStyles.pageContainer}>
            <Stack.Screen 
                options={{
                    headerTitle: () => (
                        <HeaderDropDown
                            title="Dalle-E"
                            onSelect={() => {}}
                            items={[
                                { key: 'share', title: 'Share GPT', icon: 'square.and.arrow.up'},
                                { key: 'details', title: 'See Details', icon: 'info.circle' },
                                { key: 'keep', title: 'Keep in Sidebar', icon: 'pin'}
                            ]}
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