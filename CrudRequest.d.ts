import RequestOptions from "./RequestOptions";
import NotifyOptions from "./NotifyOptions";
import AlertOptions from "./AlertOptions";
import ConfirmOptions from "./ConfirmOptions";
import ChooseFileOptions from "./ChooseFileOptions";
import PromptOptions from "./PromptOptions";
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
    alert(options?: AlertOptions): Promise<any>;
    confirm(options?: ConfirmOptions): Promise<boolean>;
    prompt(options?: PromptOptions): Promise<any>;
    dialog(options: any): Promise<any>;
    notify(options?: NotifyOptions): Promise<any>;
    toggleLoading(value: boolean): void;
    chooseFile(options?: ChooseFileOptions): Promise<any>;
}
