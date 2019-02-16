import * as _ from "lodash";
import {CrudRequest, RequestOptions} from "../index";
import URLSearchParams = require("url-search-params");

declare global {
    interface FormData {
        merge(data: any): this
    }

    interface URLSearchParams {
        merge(data: any): this
    }
}

const isFile = value => {
    if (value.uri && value.name && value.type) {
        return true;
    } else {
        return false;
    }
}


const mergeData = (formData: FormData | URLSearchParams, data: any, key?: string) => {
    if (_.isObject(data) && !isFile(data)) {
        _.each(data, (value, _key) => {
            const name = key ? `${key}[${_key}]` : _key;
            mergeData(formData, value, name);
        })
    } else if (key && data !== undefined) {
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

function fetchRequest(this: CrudRequest, config: RequestOptions) {

    const {callbacks} = config;

    callbacks.sendRequest = function (options: RequestOptions) {
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
                ajaxOptions,
                reload: reloadPage = false
            } = config;


            let requestOptions: RequestInit = {
                ...ajaxOptions,
                method: method,
                credentials: "include"
            }

            let _url = baseUrl + prefix + url + suffix + extension;

            if (!_.isEmpty(data)) {
                if (method.toLowerCase() === 'post') {
                    if (!(data instanceof FormData)) {
                        requestOptions.body = new FormData().merge(data);
                    }
                } else {
                    const params = new URLSearchParams().merge(data);
                    _url += "?" + params;
                }

                if (requestOptions.body instanceof FormData) {
                    requestOptions.headers = {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            }

            this.toggleLoading(true);

            fetch(_url, requestOptions).then(response => {
                return new Promise((resolve, reject) => {
                    if (response.status === 200) {
                        resolve(response.text())
                    } else {
                        reject(response);
                    }
                })
            }).then((responseText: string) => {
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

            }, (error) => {

                showProgress && this.toggleLoading(false);

                notify && this.notify({
                    type: "error",
                    message: `Something went wrong`
                });

                reject(error)
            })
        })
    }

    return config;
}

export default fetchRequest;
