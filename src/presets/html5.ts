import * as _ from "lodash";
import {RequestOptions} from "../RequestOptions";
import URLSearchParams = require("url-search-params");
import {ChooseFileOptions} from "../ChooseFileOptions";

declare global {
    interface FormData {
        merge(data: any): this
    }

    interface URLSearchParams {
        merge(data: any): this
    }

    interface File {
        url: string
    }
}

const isFile = value => (value instanceof File || value instanceof Blob)

const mergeData = (formData: FormData | URLSearchParams, data: any, key?: string) => {
    if (_.isObject(data) && !isFile(data)) {
        _.each(data, (value, _key) => {
            const name = key ? `${key}[${_key}]` : _key;
            mergeData(formData, value, name);
        })
    } else if (key && data !== undefined) {
        // @ts-ignore
        formData.append(key, (data !== false && !data) ? "" : data);
    }
}

FormData.prototype.merge = function (data: Object) {
    mergeData(this, data);
    return this;
}

URLSearchParams.prototype.merge = function (data: Object) {
    mergeData(this, data);
    return this;
}

export function fetchRequest($config: RequestOptions): RequestOptions {
    $config.callbacks.sendRequest = function (options: RequestOptions) {
        return new Promise((resolve, reject) => {
            const config = {
                checkDataType: true,
                notify: true,
                ...this.$config,
                ...options,
            }

            const {data, callbacks, method = "get", baseUrl = '', url, redirectTo, showProgress = true, prefix = "", suffix = "", extension = "", checkDataType} = config;
            const reloadPage = config.reload;
            const {loading, reload, redirect, checkSuccess, notify} = callbacks;

            const successCallback = responseText => {
                let response;
                try {
                    response = JSON.parse(responseText);
                } catch (e) {
                    response = responseText;
                }
                // @ts-ignore
                showProgress && loading && loading(false);
                if (method.toLowerCase() === 'get' || !checkSuccess) {
                    resolve(response);
                } else if (checkSuccess) {
                    if (checkDataType && checkSuccess(response)) {
                        resolve(response);
                        // @ts-ignore
                        (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                    } else if (!checkDataType) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                    const notification: any = {
                        type: response.type,
                        message: response.message
                    }
                    // @ts-ignore
                    config.notify && notify && notify(notification);
                }
            }

            const errorCallback = (error) => {
                // @ts-ignore
                showProgress && loading && loading(false);
                const notification: any = {
                    type: "error"
                }
                notification.message = `${error.status}: ${error.statusText}`;
                // @ts-ignore
                config.notify && notify && notify(notification);
                reject(error)
            }

            const ajaxOptions: RequestInit = {
                headers: {},
                credentials: "include",
                ...config.ajaxOptions,
            }

            ajaxOptions.method = method;
            let fullUrl = baseUrl + prefix + url + suffix + extension;

            if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                const formData = new FormData().merge(data);
                ajaxOptions.body = formData;
            }

            if (ajaxOptions.body instanceof FormData) {
                ajaxOptions.method = "post";
            } else if (data) {
                const params = new URLSearchParams().merge(data);
                fullUrl += "?" + params;
            }

            // @ts-ignore
            showProgress && loading && loading(true);

            fetch(fullUrl, ajaxOptions).then(response => {
                return new Promise((resolve, reject) => {
                    if (response.status === 200) {
                        resolve(response.text())
                    } else {
                        reject(response);
                    }
                })
            }).then(successCallback, errorCallback)
        })
    }
    return $config;
}

export function chooseFile(config: RequestOptions): RequestOptions {

    const {callbacks} = config;

    callbacks.chooseFile = (options: ChooseFileOptions): Promise<File | File[]> => {
        const {multiple, accept} = options;
        let input: HTMLInputElement = document.querySelector('.sk-file-input');

        if (!input) {
            input = document.createElement('input');
            input.type = "file";
            input.accept = _.isArray(accept) ? accept.join(",") : accept;
            input.multiple = multiple;
            input.style.display = "none";
            input.className = "sk-file-input";
            document.querySelector("body").appendChild(input);
        }

        input.click();
        return new Promise(resolve => {
            const changeHandler = e => {
                const files = e.currentTarget.files;
                const filesArray = [];
                _.each(files, file => {
                    file.url = URL.createObjectURL(file);
                    filesArray.push(file)
                });
                if (multiple) {
                    resolve(filesArray);
                } else {
                    resolve(files[0]);
                }
            }

            input.addEventListener('change', changeHandler)

        })
    }

    return config;
}
