export interface RequestOptions {
    baseUrl?: string;
    callbacks?: {
        loading?: (value: boolean) => void;
        redirect?: (to: any, data?: any) => void;
        reload?: () => void;
        createRequest?: () => void;
        checkSuccess?: (data: any) => boolean;
        notify?: (this: CrudRequest, data: any) => Promise<any>;
        dialog?: (this: CrudRequest, component: any, options: any) => Promise<any>;
        prompt?: (this: CrudRequest, options: any) => Promise<any>;
        confirm?: (this: CrudRequest, options: any) => Promise<any>;
        alert?: (this: CrudRequest, options: any) => Promise<any>;
        sendRequest?: (this: CrudRequest, options: RequestOptions) => Promise<any>;
        chooseFile?: (this: CrudRequest, options: ChooseFileOptions) => Promise<File | File[]>;
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
    config(callback: (this: CrudRequest, config: RequestOptions) => RequestOptions): CrudRequest;
    send(options: RequestOptions): Promise<any>;
    create(url: string, data?: any, options?: RequestOptions): Promise<any>;
    update(url: string, data?: any, options?: RequestOptions): Promise<any>;
    delete(url: string, data?: any, options?: RequestOptions): Promise<any>;
    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any>;
    redirect(to: any, options: any): void;
    alert(options: any): Promise<any>;
    confirm(options: any): Promise<boolean>;
    prompt(options: any): Promise<any>;
    dialog(name: string, options: any): Promise<any>;
    notify(options: any): Promise<any>;
    toggleLoading(value: boolean): void;
    chooseFile(options?: ChooseFileOptions): Promise<File | File[]>;
}
