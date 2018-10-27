import {ajax} from "jquery";
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
                ...this.$config,
                ...options,
            }

            const {data, callbacks, method, baseUrl, url, redirectTo, showProgress, prefix} = config;
            const reloadPage = config.reload;
            const {loading, reload, redirect, checkSuccess, notify} = callbacks;

            const ajaxOptions: AjaxSettings = {
                ...config.ajaxOptions,
                success: response => {
                    showProgress && loading && loading(false);
                    if (method.toLowerCase() === 'get' || !checkSuccess) {
                        resolve(response);
                    } else if (checkSuccess) {
                        if (checkSuccess(response)) {

                            resolve(response);
                            // @ts-ignore
                            (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());

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
            ajaxOptions.data = data;

            showProgress && loading && loading(true);

            ajax(ajaxOptions);
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
}