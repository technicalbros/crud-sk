import $ from "jquery";
import * as _ from "lodash";
import AjaxSettings = JQuery.AjaxSettings;

export interface DefaultRequestOptions {
    baseUrl?: string,
    callbacks?: {
        loading?: (value: boolean) => void,
        redirect?: (to: any, data?: any) => void,
        reload?: () => void,
        checkSuccess?: (data: any) => boolean,
        notify?: (data: any) => void,
        dialog?: (component: any, options: any) => Promise<any>,
        prompt?: (options: any) => Promise<any>
        confirm?: (options: any) => Promise<any>
        alert?: (options: any) => Promise<any>
    }
}

export interface RequestOptions extends DefaultRequestOptions {
    prefix?: string,
    url?: string,
    data?: any,
    redirectTo?: string,
    checkDataType?: boolean,
    showProgress?: boolean,
    notify?: boolean,
    goto?: string,
    reload?: boolean,
    method?: "post" | "get" | "put" | "delete" | string
    ajaxOptions?: AjaxSettings
}

export interface ChooseFileOptions {
    accept?: string | string[],
    multiple?: boolean
}

declare global {
    interface FormData {
        merge(data: any): this
    }

    interface File {
        url: string
    }
}

var mergeData = (formData: FormData, data: any, key?: string) => {

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

export class CrudRequest {

    $config: DefaultRequestOptions = {
        baseUrl: "",
        callbacks: {
            notify: (data) => {
                alert(data.message);
            },
            checkSuccess: (data) => {
                if (data.type === 'success') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    send(options: RequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const config = {
                checkDataType: true,
                notify: true,
                ...this.$config,
                ...options,
            }

            const {data, callbacks, method, baseUrl, url, redirectTo, showProgress, prefix = "", checkDataType} = config;
            const reloadPage = config.reload;
            const {loading, reload, redirect, checkSuccess, notify} = callbacks;

            const ajaxOptions: AjaxSettings = {
                ...config.ajaxOptions,
                success: response => {
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
            ajaxOptions.url = baseUrl + prefix + url;

            if (method.toLowerCase() === 'post') {
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
    }

    create(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.send({
            method: "post",
            prefix: "create/",
            ...options,
            url: url,
            data: data,
        })
    }

    update(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "post",
            prefix: "update/",
            ...options,
            url: url,
            data: data,
        })
    }

    delete(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "post",
            prefix: "delete/",
            ...options,
            url: url,
            data: data,
        })
    }

    retrieve(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "get",
            prefix: "retrieve/",
            checkDataType: false,
            notify: false,
            ...options,
            url: url,
            data: data,
        })
    }

    alert(options: any): Promise<any> {
        return this.$config.callbacks.alert(options);
    }

    confirm(options: any): Promise<boolean> {
        return this.$config.callbacks.confirm(options);
    }

    prompt(options: any): Promise<any> {
        return this.$config.callbacks.prompt(options);
    }

    dialog(name: string, options: any): Promise<any> {
        return this.$config.callbacks.dialog(name, options);
    }

    notify(options: any): void {
        this.$config.callbacks.notify(options);
    }

    chooseFile(options: ChooseFileOptions = {}): Promise<File | File[]> {
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
}


declare  global {
    interface Window {
        CrudRequest: typeof CrudRequest;
    }
}

window.CrudRequest = CrudRequest;