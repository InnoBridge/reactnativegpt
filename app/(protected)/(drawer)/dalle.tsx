import { View, Text } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import HeaderDropDown from "@/components/HeaderDropDown";
import { Stack } from "expo-router";

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
}

export default Page;