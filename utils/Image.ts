import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

// https://stackoverflow.com/questions/73706343/i-want-to-download-an-image-with-react-native-expo-from-a-url
const downloadAndSaveImage = async (imageUrl: string) => {
    let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;
    
    try {
        const res = await FileSystem.downloadAsync(imageUrl, fileUri);
        return saveFile(res.uri);
    } catch (err) {
        console.log("FS Err: ", err);
    }
};

const saveFile = async (fileUri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    switch (status) {
        case MediaLibrary.PermissionStatus.GRANTED:
            try {
                console.log("File URI: ", fileUri);
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                console.log("Asset: ", asset);
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album === null) {
                    const result = await MediaLibrary.createAlbumAsync('Download', asset, false);
                    if (result) {
                        Alert.alert('Image saved to Photos');
                    }
                } else {
                    const result = await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    if (result) {
                        Alert.alert('Image saved to Photos');
                    }
                }
            } catch (err) {
                console.log("Permission Error: ", err);
            }
            break;
        default:
            Alert.alert("Please allow permission to download");
    }
};

const copyImageToClipboard = async (imageUrl: string) => {
    let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;
    try {
        const res = await FileSystem.downloadAsync(imageUrl, fileUri);
        const base64 = await FileSystem.readAsStringAsync(res.uri, {
            encoding: FileSystem.EncodingType.Base64
        });
        await Clipboard.setImageAsync(base64);
    } catch (err) {
        console.log("FS Err: ", err);
    }
};

const shareImage = async (imageUrl: string) => {
    Sharing.shareAsync(imageUrl);
};

export {
    downloadAndSaveImage,
    copyImageToClipboard,
    shareImage
};