export interface RequestOptions {
    baseUrl?: string;
    callbacks?: {
        loading?: (value: boolean) => void;
        redirect?: (to: any, data?: any) => void;
        reload?: () => void;
        checkSuccess?: (data: any) => boolean;
        notify?: (data: any) => Promise<any>;
        dialog?: (component: any, options: any) => Promise<any>;
        prompt?: (options: any) => Promise<any>;
        confirm?: (options: any) => Promise<any>;
        alert?: (options: any) => Promise<any>;
        sendRequest?: (options: RequestOptions) => Promise<any>;
        chooseFile?: (options: ChooseFileOptions) => Promise<File | File[]>;
    };
    prefix?: string;
    suffix?: string;
    extension?: string;
    url?: string;
    data?: any;
    redirectTo?: string;
    checkDataType?: boolean;
    showProgress?: boolean;
    notify?: boolean;
    goto?: string;
    reload?: boolean;
    method?: "post" | "get" | "put" | "delete" | string;
    ajaxOptions?: any;
}
export interface ChooseFileOptions {
    accept?: string | string[];
    multiple?: boolean;
}
export declare class CrudRequest {
    $config: RequestOptions;

    config(callback: (config: RequestOptions) => RequestOptions): CrudRequest;
    send(options: RequestOptions): Promise<any>;
    create(url: string, data?: any, options?: RequestOptions): Promise<any>;
    update(url: string, data?: any, options?: RequestOptions): Promise<any>;
    delete(url: string, data?: any, options?: RequestOptions): Promise<any>;
    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any>;
    alert(options: any): Promise<any>;
    confirm(options: any): Promise<boolean>;
    prompt(options: any): Promise<any>;
    dialog(name: string, options: any): Promise<any>;

    notify(options: any): Promise<any>;
    chooseFile(options?: ChooseFileOptions): Promise<File | File[]>;
}
