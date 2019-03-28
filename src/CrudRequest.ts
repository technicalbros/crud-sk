import RequestOptions from "./RequestOptions";
import NotifyOptions from "./NotifyOptions";
import AlertOptions from "./AlertOptions";
import ConfirmOptions from "./ConfirmOptions";
import ChooseFileOptions from "./ChooseFileOptions";
import PromptOptions from "./PromptOptions";

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
        }
    }

    config(callback: (this: CrudRequest, config: RequestOptions) => RequestOptions): this {
        const config = {...this.defaultConfig}
        callback.apply(this, [config])
        this.defaultConfig = config;
        return this;
    }

    async send(options: RequestOptions): Promise<any> {
        return this.call('sendRequest', [options]);
    }

    async create(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("createRequest", [url, data, options]);
    }

    async retrieve(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("retrieveRequest", [url, data, options]);
    }

    async update(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("updateRequest", [url, data, options]);
    }

    async delete(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.call("deleteRequest", [url, data, options]);
    }

    redirect(to: any, options?: any): void {
        this.call("redirect", [to, options])
    }

    reload(): void {
        this.call("reload");
    }

    async alert(options?: AlertOptions): Promise<any> {
        return this.call("alert", [options]);
    }

    async confirm(options?: ConfirmOptions): Promise<boolean> {
        return this.call("confirm", [options]);
    }

    async prompt(options?: PromptOptions): Promise<any> {
        return this.call("prompt", [options]);
    }

    async dialog(options: any): Promise<any> {
        return this.call("dialog", [options]);
    }

    async notify(options?: NotifyOptions): Promise<any> {
        return this.call("notify", [options]);
    }

    toggleLoading(value: boolean): void {
        return this.call("loading", [value]);
    }

    async chooseFile(options: ChooseFileOptions): Promise<any> {
        return this.call("chooseFile", [options]);
    }
}
