import {CrudRequest, RequestOptions} from "../src";
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
    } else if (key && data !== undefined) {
        formData.append(key, data || '');
    }
}

FormData.prototype.merge = function (data: Object) {
    mergeData(this, data);
    return this;
}

export function ajaxRequest(this: CrudRequest, config: RequestOptions) {

    const {callbacks} = config;

    callbacks.sendRequest = (options: RequestOptions) => {
        const config = {
            checkDataType: true,
            showProgress: true,
            notify: true,
            ...this.$config,
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
            notify
        } = config;
        const reloadPage = config.reload;
        const {loading, reload, redirect, checkSuccess, notify: notifyCallback} = callbacks;

        return new Promise((resolve, reject) => {

            const ajaxOptions: AjaxSettings = {
                ...config.ajaxOptions,
                success: responseText => {
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

                        if (!checkDataType || (checkDataType && checkSuccess(response))) {
                            resolve(response);
                        } else {
                            reject(response);
                        }

                        notify && this.notify({
                            type: response.type,
                            message: response.message
                        });
                    }

                },
                error: (error) => {

                    showProgress && this.toggleLoading(false);

                    notify && this.notify({
                        type: "error",
                        message: `${error.status}: ${error.statusText}`
                    });

                    reject(error)
                }
            }

            ajaxOptions.type = method;
            ajaxOptions.url = baseUrl + prefix + url + suffix + extension;

            if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                ajaxOptions.data = new FormData().merge(data);
            } else {
                ajaxOptions.data = data;
            }

            if (ajaxOptions.data instanceof FormData) {
                ajaxOptions.type = "post";
                ajaxOptions.cache = false;
                ajaxOptions.processData = false;
                ajaxOptions.contentType = false;
            }

            this.toggleLoading(true);

            $.ajax(ajaxOptions);

        }).then(data => {
            if (redirectTo && redirect) {
                this.redirect(redirectTo);
            } else if (reloadPage && reload) {
                this.reload();
            }
            return data;
        })
    }

    return config;
}

export default ajaxRequest;