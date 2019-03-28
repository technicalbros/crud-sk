import RequestOptions from "./RequestOptions";

export default class CrudRequest {

    defaultConfig: RequestOptions = {
        callbacks: {
            checkSuccess: ({type} = {}) => {
                return type === 'success';
            },
            createRequest: (url, data, options) => this.send({
                method: "post",
                prefix: "create/",
                ...options,
                url,
                data,
            }),
            updateRequest: (url, data, options) => this.send({
                method: "post",
                prefix: "update/",
                ...options,
                url,
                data,
            }),
            deleteRequest: (url, data, options) => this.send({
                method: "post",
                prefix: "delete/",
                ...options,
                url,
                data,
            }),
            retrieveRequest: (url, data, options) => this.send({
                method: "get",
                prefix: "retrieve/",
                checkDataType: false,
                notify: false,
                ...options,
                url,
                data,
            })
        }
    }

    call(callbackName: "loading" | "redirect" | "reload" | "transformParams" | "transformResponse" | "checkSuccess" | "createRequest" | "retrieveRequest" | "updateRequest" | "deleteRequest" | "notify" | "dialog" | "prompt" | "confirm" | "alert" | "sendRequest" | "chooseFile", args: Array<any> = []): any {
        const callback: Function = this.defaultConfig.callbacks[callbackName];
        if (callback) {
            return callback.apply(this, args)
        } else {
            console.warn(`No callback defined for '${callbackName}'`)
        }
    }

    config(callback: (this: CrudRequest, config: RequestOptions) => RequestOptions): this {
        const config = {...this.defaultConfig}
        callback.apply(this, [config])
        this.defaultConfig = config;
        return this;
    }

    send(options: RequestOptions): Promise<any> {
        return this.call('sendRequest', [options]);
    }

    create(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("createRequest", [url, data, options]);
    }

    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("retrieveRequest", [url, data, options]);
    }

    update(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("updateRequest", [url, data, options]);
    }

    delete(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("deleteRequest", [url, data, options]);
    }

    redirect(to: any, options?: any): void {
        this.call("redirect", [to, options])
    }

    reload(): void {
        this.call("confirm");
    }

    alert(options?: any): Promise<any> {
        return this.call("alert", [options]);
    }

    confirm(options?: any): Promise<boolean> {
        return this.call("confirm", [options]);
    }

    prompt(options?: any): Promise<any> {
        return this.call("prompt", [options]);
    }

    dialog(name: string, options: any): Promise<any> {
        return this.call("dialog", [options]);
    }

    notify(options?: any): Promise<any> {
        return this.call("notify", [options]);
    }

    toggleLoading(value: boolean): void {
        return this.call("loading", [value]);
    }

    async chooseFile(options: any): Promise<any> {
        return this.call("chooseFile", [options]);
    }
}
