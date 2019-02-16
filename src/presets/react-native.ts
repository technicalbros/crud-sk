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
                checkDataType: true,
                showProgress: true,
                notify: true,
                ...this.defaultConfig,
                ...options,
            }

            const {
                data,
                callbacks,
                method = "get",
                baseUrl,
                url,
                redirectTo,
                showProgress,
                prefix = "",
                suffix = "",
                extension = "",
                checkDataType,
                ajaxOptions,
                reload: reloadPage
            } = config;
            const {loading, reload, redirect, checkSuccess, notify} = callbacks;


            let requestOptions: RequestInit = {
                ...ajaxOptions,
                method: method,
                credentials: "include"
            }

            let _url = baseUrl + prefix + url + suffix + extension;

            if (!_.isEmpty(data)) {
                if (method.toLowerCase() === 'post') {
                    if (!(data instanceof FormData)) {
                        console.log('formData', data)
                        const formData = new FormData().merge(data);
                        requestOptions.body = formData;
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

            fetch(_url, requestOptions).then(data => {
                data.json().then(response => {

                    showProgress && loading && this.toggleLoading(false);

                    if (checkSuccess) {
                        if (checkDataType && checkSuccess(response)) {
                            resolve(response);
                            // @ts-ignore
                            redirectTo && this.redirect(redirectTo)
                            reloadPage && this.reload();
                        } else if (!checkDataType) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                        this.notify({
                            type: response.type,
                            message: response.message
                        });
                    } else {
                        resolve(response);
                    }
                }).catch(e => {

                    showProgress && loading && this.toggleLoading(false);

                    notify && this.notify({
                        type: "error",
                        message: "Something went wrong"
                    });
                })
            }, (error) => {

                showProgress && loading && this.toggleLoading(false);

                reject(error)
            })
        })
    }

    return config;
}

export default fetchRequest;