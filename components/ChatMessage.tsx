import Colors from '@/constants/Colors';
import { Text, View, Image, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
// import { Message, Role } from '@/utils/Interfaces';
import { requestMessage, enums } from '@innobridge/llmclient';
import * as ContextMenu from 'zeego/context-menu';
import { downloadAndSaveImage, copyImageToClipboard, shareImage } from '@/utils/Image';

const { Role } = enums;

export type ChatMessageProps = requestMessage.Message & {
    imageUrl?: string;
    prompt?: string;
    loading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
    content, 
    role, 
    imageUrl, 
    prompt,
    loading}) => {
    const contextItems = [
        {
            title: 'Copy',
            systemIcon: 'doc.on.doc',
            onPress: (imageUrl: string) => {
                copyImageToClipboard(imageUrl);
            }
        },
        {
            title: "Save to Photos",
            systemIcon: 'arrow.down.to.line',
            onPress: (imageUrl: string) => {
                downloadAndSaveImage(imageUrl);
            }
        },
        {
            title: 'Share',
            systemIcon: 'square.and.arrow.up',
            onPress: (imageUrl: string) => {
                shareImage(imageUrl);
            }
        }
    ];
    return (
        <View style={styles.row}>
            {role === Role.BOT ? (
                <View style={[styles.item]}>
                    <Image source={require('@/assets/images/logo-white.png')} style={styles.btnImage} />
                </View>
            ) : (
                <Image source={{ uri: 'https://galaxies.dev/img/meerkat_2.jpg'}} style={styles.avatar} />
            )}
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator color={Colors.primary} />
                </View>
                ): (
            <View style={styles.contentContainer}>
                <Text style={styles.text}>{content as string} hello world</Text>
                {imageUrl && (
                    <ContextMenu.Root>
                        <ContextMenu.Trigger>
                            <Pressable>
                                <Image source={{ uri: imageUrl }} style={styles.messageImage} />
                            </Pressable>
                        </ContextMenu.Trigger>
                        <ContextMenu.Content>
                            <View style={{ padding: 10 }}>
                            </View>
                            {contextItems.map((item, index) => (
                                <ContextMenu.Item
                                    key={item.title}
                                    onSelect={() => item.onPress(imageUrl)}
                                >
                                    <ContextMenu.ItemTitle>{item.title}</ContextMenu.ItemTitle>
                                    <ContextMenu.ItemIcon 
                                        ios={{ 
                                            name: item.systemIcon as any,
                                            pointSize: 18
                                         }} 
                                    />
                                </ContextMenu.Item>
                            ))}
                            <ContextMenu.Separator />
                        </ContextMenu.Content>
                    </ContextMenu.Root>
                )}
            </View>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 14,
        gap: 14,
        marginVertical: 12
    },
    item: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: Colors.black
    },
    btnImage: {
        margin: 6,
        width: 16,
        height: 16
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.black
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 8,  // Space between text and image
    },
    text: {
        padding: 4,
        fontSize: 16,
        flexWrap: 'wrap',
        // flex: 1
    },
    previewImage: {
        width: 40,
        height: 240,
        borderRadius: 10
    },
    loading: {
        justifyContent: 'center',
        height: 26,
        marginLeft: 14
    },
    messageImage: {
        width: 240,
        height: 240,
        borderRadius: 10
    }
});

export default ChatMessage;