import {Toast} from "native-base";
import {RequestOptions} from "../index";

export function notify($config: RequestOptions) {

    $config.callbacks.notify = data => new Promise((resolve) => {
        Toast.show({
            text: data.message,
            buttonText: "Hide",
            type: data.type === "success" ? "success" : "danger",
            onClose: resolve
        })
    })

    return $config;
}
