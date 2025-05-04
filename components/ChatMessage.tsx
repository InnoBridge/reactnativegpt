import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Text, View, Image } from 'react-native';
// import { Message, Role } from '@/utils/Interfaces';
import { requestMessage, enums } from '@innobridge/llmclient';

const { Role } = enums;

export type ChatMessageProps = requestMessage.Message & {
    imageUrl?: string;
    prompt?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, imageUrl, prompt }) => {
    return (
        <View style={styles.row}>
            {role === Role.BOT ? (
                <View style={[styles.item]}>
                    <Image source={require('@/assets/images/logo-white.png')} style={styles.btnImage} />
                </View>
            ) : (
                <Image source={{ uri: 'https://galaxies.dev/img/meerkat_2.jpg'}} style={styles.avatar} />
            )}
            <View style={styles.contentContainer}>
                <Text style={styles.text}>{content as string}</Text>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.messageImage} />
                )}
            </View>
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