import ImagePicker from 'react-native-image-picker';
import {RequestOptions} from "../src";

export default function ($config: RequestOptions) {

    $config.callbacks.chooseFile = options => new Promise<any>((resolve, reject) => {

        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel || response.error) {
                reject(response);
            } else {
                resolve({
                    ...response,
                    type: response.type || 'image/jpeg',
                    url: response.uri,
                    name: response.fileName
                });
            }
        });

    })

    return $config;
}