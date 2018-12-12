import {ChooseFileOptions, RequestOptions} from "../src";
import * as _ from "lodash";
import $ from "jquery";
import AjaxSettings = JQuery.AjaxSettings;

declare global {
    interface FormData {
        merge(data: any): this
    }

    interface File {
        url: string
    }
}

const mergeData = (formData: FormData, data: any, key?: string) => {
    if (_.isObject(data) && !(data instanceof File) && !(data instanceof Blob)) {
        _.each(data, (value, _key) => {
            const name = key ? `${key}[${_key}]` : _key;
            mergeData(formData, value, name);
        })
    } else if (key) {
        formData.append(key, data);
    }

}

FormData.prototype.merge = function (data: Object) {
    mergeData(this, data);
    return this;
};

export default function (config: RequestOptions) {

    const {callbacks} = config;

    callbacks.sendRequest = (options: RequestOptions) => new Promise((resolve, reject) => {
        const config = {
            checkDataType: true,
            notify: true,
            ...this.$config,
            ...options,
        }

        const {data, callbacks, method = "get", baseUrl, url, redirectTo, showProgress, prefix = "", suffix = "", extension = "", checkDataType} = config;
        const reloadPage = config.reload;
        const {loading, reload, redirect, checkSuccess, notify} = callbacks;

        const ajaxOptions: AjaxSettings = {
            ...config.ajaxOptions,
            success: responseText => {
                let response;
                try {
                    response = JSON.parse(responseText);
                } catch (e) {
                    response = responseText;
                }
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
                    config.notify && notify && notify(notification);
                }
            },
            error: (error) => {
                showProgress && loading && loading(false);
                const notification: any = {
                    type: "error"
                }
                notification.message = `${error.status}: ${error.statusText}`;
                config.notify && notify && notify(notification);
                reject(error)
            }
        }

        ajaxOptions.type = method;
        ajaxOptions.url = baseUrl + prefix + url + suffix + extension;

        if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
            const formData = new FormData().merge(data);
            ajaxOptions.data = formData;
        } else {
            ajaxOptions.data = data;
        }

        if (ajaxOptions.data instanceof FormData) {
            ajaxOptions.type = "post";
            ajaxOptions.cache = false;
            ajaxOptions.processData = false;
            ajaxOptions.contentType = false;
        }

        showProgress && loading && loading(true);

        $.ajax(ajaxOptions);
    })

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
        $('input').click();
        return new Promise(resolve => {
            $(input).one('change', e => {
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
            })
        })
    }

    return config;
}