import { RequestOptions } from "./RequestOptions";
import { ChooseFileOptions } from "./ChooseFileOptions";
export declare class CrudRequest {
    $config: RequestOptions;
    config(callback: (this: CrudRequest, config: RequestOptions) => RequestOptions): this;
    send(options: RequestOptions): Promise<any>;
    create(url: string, data?: any, options?: RequestOptions): Promise<any>;
    update(url: string, data?: any, options?: RequestOptions): Promise<any>;
    delete(url: string, data?: any, options?: RequestOptions): Promise<any>;
    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any>;
    redirect(to: any, options?: any): void;
    alert(options?: any): Promise<any>;
    confirm(options?: any): Promise<boolean>;
    prompt(options?: any): Promise<any>;
    dialog(name: string, options: any): Promise<any>;
    notify(options?: any): Promise<any>;
    toggleLoading(value: boolean): void;
    chooseFile(options?: ChooseFileOptions): Promise<File | File[]>;
    reload(): void;
}
