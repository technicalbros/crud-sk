import * as _ from "lodash";
import {RequestOptions} from "../RequestOptions";
import {ChooseFileOptions} from "../ChooseFileOptions";
import {CrudRequest} from "../CrudRequest";
import URLSearchParams = require("url-search-params");

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

export function fetchRequest(this: CrudRequest, $config: RequestOptions): RequestOptions {

    $config.callbacks.redirect = (to: string) => {
        window.location.href = to
    }

    $config.callbacks.reload = () => window.location.reload()

    $config.callbacks.alert = ({title, textContent}) => new Promise(() => {
        alert(`${title} : ${textContent}`)
    })

    $config.callbacks.sendRequest = function (options: RequestOptions) {
        return new Promise((resolve, reject) => {

            const config = {
                ...this.defaultConfig,
                ...options,
            }

            const {
                data,
                url,
                method = "get",
                baseUrl = "",
                prefix = "",
                suffix = "",
                extension = "",
                redirectTo = false,
                showProgress = true,
                checkDataType = true,
                notify = true,
                reload: reloadPage = false
            } = config;

            const successCallback = responseText => {
                let response;
                try {
                    response = JSON.parse(responseText);
                } catch (e) {
                    response = responseText;
                }

                showProgress && this.toggleLoading(false);

                if (method.toLowerCase() === 'get') {
                    resolve(response);
                } else {

                    if (!checkDataType || this.call("checkSuccess", [data])) {
                        resolve(response);
                    } else {
                        reject(response);
                    }

                    notify && this.notify({
                        type: response.type,
                        message: response.message
                    });
                }
            }

            const errorCallback = (error) => {
                showProgress && this.toggleLoading(false);

                notify && this.notify({
                    type: "error",
                    message: `${error.status}: ${error.statusText}`
                });

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
                ajaxOptions.body = new FormData().merge(data);
            }

            if (ajaxOptions.body instanceof FormData) {
                ajaxOptions.method = "post";
            } else if (data) {
                const params = new URLSearchParams().merge(data);
                fullUrl += "?" + params;
            }

            showProgress && this.toggleLoading(true);

            fetch(fullUrl, ajaxOptions).then(response => {
                return new Promise((resolve, reject) => {
                    if (response.status === 200) {
                        resolve(response.text())
                    } else {
                        reject(response);
                    }
                })
            }).then(successCallback, errorCallback).then(data => {
                if (redirectTo) {
                    this.redirect(redirectTo);
                } else if (reloadPage) {
                    this.reload();
                }
                return data;
            })
        })
    }
    return $config;
}

export function chooseFile(config: RequestOptions): RequestOptions {

    const {callbacks} = config;

    callbacks.chooseFile = ({multiple, accept}: ChooseFileOptions = {}): Promise<File | File[]> => {
        
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
