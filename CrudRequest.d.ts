import RequestOptions from "./RequestOptions";
export default class CrudRequest {
    defaultConfig: RequestOptions;
    call(callbackName: "loading" | "redirect" | "reload" | "transformParams" | "transformResponse" | "checkSuccess" | "createRequest" | "retrieveRequest" | "updateRequest" | "deleteRequest" | "notify" | "dialog" | "prompt" | "confirm" | "alert" | "sendRequest" | "chooseFile", args?: Array<any>): any;
    config(callback: (this: CrudRequest, config: RequestOptions) => RequestOptions): this;
    send(options: RequestOptions): Promise<any>;
    create(url: string, data?: any, options?: RequestOptions): Promise<any>;
    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any>;
    update(url: string, data?: any, options?: RequestOptions): Promise<any>;
    delete(url: string, data?: any, options?: RequestOptions): Promise<any>;
    redirect(to: any, options?: any): void;
    reload(): void;
    alert(options?: any): Promise<any>;
    confirm(options?: any): Promise<boolean>;
    prompt(options?: any): Promise<any>;
    dialog(name: string, options: any): Promise<any>;
    notify(options?: any): Promise<any>;
    toggleLoading(value: boolean): void;
    chooseFile(options: any): Promise<any>;
}
