import { Drawer } from 'expo-router/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList,useDrawerStatus } from '@react-navigation/drawer';
import { TextInput } from 'react-native-gesture-handler';
import { DrawerActions } from '@react-navigation/native';
import { useEffect } from 'react';

export const CustomDrawerContent = (props: any) => {
    const router = useRouter();
    const { bottom, top } = useSafeAreaInsets();
    // const db = useSQLiteContex();
    const isDrawerOpen = useDrawerStatus() === 'open';
    // const [history, setHistory] = useState<Chat[]>([]);    
    // const router = useRouter();

    useEffect(() => {
        console.log('Drawer status:', useDrawerStatus);
    }, [isDrawerOpen])

    // useEffect(() => {
    //     loadChats();
    //     Keyboard.dismiss();
    // }, [isDrawerOpen]);

    // const loadChats = async () => {
    //     // Load chats from SQLite
    //     const result = (await getChats(db)) as Chat[];
    //     setHistory(result);
    // };

    // const onDeleteChat = (chatId: number) => {
    //     Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
    //         {
    //             text: 'Cancel',
    //             style: 'cancel'
    //         },
    //         {
    //             text: 'Delete',
    //             onPress: async () => {
    //                 // Delete the chat
    //                 await dismissBrowser.runAsync('DELETE FROM chats Where id = ?', chatId);
    //                 loadChats();
    //             }
    //         }
    //     ]);
    // };

    return (
        <View style={{ flex: 1, marginTop: top }}>
            <View style={{backgroundColor: Colors.white, paddingBottom: 16 }}>
                <View style={styles.searchSection}>
                    <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.greyLight} />
                    <TextInput style={styles.input} placeholder='Search' underlineColorAndroid={'transparent'} />
                </View>
            </View>
            <DrawerContentScrollView 
            contentContainerStyle={{ paddingTop: 0 }}
            {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={{ padding: 16, paddingBottom: bottom }}>
                <TouchableOpacity style={styles.footer}>
                    <Image
                        source={{ uri: 'https://galaxies.dev/img/meerkat_2.jpg' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>Mika Meerkat</Text>
                    <Ionicons name="ellipsis-horizontal" size={24} color={Colors.greyLight} />
                </TouchableOpacity>
            </View>

            <View
            style={{
                padding: 16,
                paddingBottom: 10 + bottom,
                backgroundColor: Colors.light
            }}>
                <TouchableOpacity
                    onPress={() => router.push("/(protected)/(modal)/settings")}
                    style={styles.footer}>
                    <Text>Settings</Text>
                    <Ionicons name="settings-outline" size={24} color={Colors.greyLight} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Layout = () => {
    const dimensions = useWindowDimensions();
    const router = useRouter();

    return (
        <Drawer
            drawerContent={CustomDrawerContent}
            screenOptions={({ navigation }) => ({
                headerLeft: () => (
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.dispatch(DrawerActions.toggleDrawer());
                          }}
                        style={{
                            marginLeft: 16
                        }}
                    >
                        <FontAwesome6 name="grip-lines" size={28} color={Colors.grey} />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: Colors.light,
                },
                headerShadowVisible: false,
                drawerActiveBackgroundColor: Colors.selected,
                drawerActiveTintColor: Colors.black,
                drawerInactiveTintColor: Colors.black,
                drawerItemStyle: { borderRadius: 12 },
                drawerLabelStyle: { marginLeft: -20 },
                overlayColor: 'rgba(0,0,0, 0.2)',
                drawerStyle: { width: dimensions.width * 0.86}
            })}>
                <Drawer.Screen 
                    name='(chat)/new' 
                    getId={() => Math.random().toString()}
                    options={{
                        title: 'ChatGpt',
                        drawerIcon: () => (
                            <View style={[styles.item, {backgroundColor: Colors.black}]}>
                                <Image 
                                    source={require('@/assets/images/logo-white.png')} 
                                    style={styles.btnImage}
                                />
                            </View>
                        ),
                    headerRight: () => (
                        <Link href={'/(protected)/(drawer)/(chat)/new'} push asChild>
                            <TouchableOpacity>
                                <Ionicons 
                                    name="create-outline"
                                    size={24}
                                    color={Colors.grey}
                                    style={{ marginRight: 16 }}
                                />
                            </TouchableOpacity>
                        </Link>
                    )
                }} 
            />
            {/* <Drawer.Screen 
                name='(chat)/[id]' 
                options={{
                    drawerItemStyle: {
                        display: 'none'
                    },
                    headerRight: () => (
                        <Link href={'/(protected)/(drawer)/(chat)/new'} push asChild>
                            <TouchableOpacity>
                                <Ionicons 
                                    name="create-outline"
                                    size={24}
                                    color={Colors.grey}
                                    style={{ marginRight: 16 }}
                                />
                            </TouchableOpacity>
                        </Link>
                    )
                }} 
            /> */}
            <Drawer.Screen 
                name='dalle' 
                options={{
                    title: 'Dall.E',
                    drawerIcon: () => (
                        <View style={[styles.item, {backgroundColor: Colors.black}]}>
                            <Image 
                                source={require('@/assets/images/dalle.png')} 
                                style={styles.dallEImage}
                            />
                        </View>
                    )
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        router.navigate('/(protected)/(drawer)/dalle')
                    }
                }}
            />
            <Drawer.Screen 
                name='explore' 
                options={{
                    title: 'Explore GPTs',
                    drawerIcon: () => (
                        <View style={[
                            styles.exploreItem
                        ]}>
                            <Ionicons name="apps-outline" size={18} color={Colors.black} />
                        </View>
                    )
                }} 
            />
        </Drawer>
    );
};

const styles = StyleSheet.create({
    searchSection: {
        marginHorizontal: 16,
        borderRadius: 10,
        height: 34,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.input
    },
    searchIcon: {
        padding: 6
    },
    input: {
        flex: 1,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 0,
        alignItems: 'center',
        color: Colors.dark
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    roundImage: {
        width: 30,
        height: 30
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1
    },
    item: {
        borderRadius: 15,
        overflow: 'hidden'
    },
    btnImage: {
        margin: 6,
        width: 16,
        height: 16
    },
    dallEImage: {
        width: 28,
        height: 28,
        resizeMode: 'cover'
    },
    exploreItem: {
        borderRadius: 15,
        backgroundColor: Colors.white,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    }

});

export default Layout;