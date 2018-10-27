import AjaxSettings = JQuery.AjaxSettings;
export interface DefaultRequestOptions {
    baseUrl?: string;
    callbacks?: {
        loading?: (value: boolean) => void;
        redirect?: (to: any, data?: any) => void;
        reload?: () => void;
        checkSuccess?: (data: any) => boolean;
        notify?: (data: any) => void;
        dialog?: (component: any, options: any) => Promise<any>;
        prompt?: (options: any) => Promise<any>;
        confirm?: (options: any) => Promise<any>;
        alert?: (options: any) => Promise<any>;
    };
}
export interface RequestOptions extends DefaultRequestOptions {
    prefix?: string;
    url?: string;
    data?: any;
    redirectTo?: string;
    checkDataType?: boolean;
    showProgress?: boolean;
    notify?: boolean;
    goto?: string;
    reload?: boolean;
    method?: "post" | "get" | "put" | "delete" | string;
    ajaxOptions?: AjaxSettings;
}
export declare class CrudRequest {
    $config: DefaultRequestOptions;
    send(options: RequestOptions): Promise<any>;
    create(url: string, data?: any, options?: RequestOptions): Promise<any>;
    update(url: string, data?: any, options?: RequestOptions): Promise<any>;
    delete(url: string, data?: any, options?: RequestOptions): Promise<any>;
    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any>;
    alert(options: any): Promise<any>;
    confirm(options: any): Promise<boolean>;
    prompt(options: any): Promise<any>;
    dialog(name: string, options: any): Promise<any>;
    notify(options: any): void;
}
