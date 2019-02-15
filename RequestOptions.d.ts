import { CrudRequest } from "./CrudRequest";
import { ChooseFileOptions } from "./ChooseFileOptions";
export interface RequestOptions {
    baseUrl?: string;
    callbacks?: {
        loading?: (this: CrudRequest, value: boolean) => void;
        redirect?: (this: CrudRequest, to: any, data?: any) => void;
        reload?: (this: CrudRequest) => void;
        checkSuccess?: (this: CrudRequest, data: any) => boolean;
        createRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>;
        retrieveRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>;
        updateRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>;
        deleteRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>;
        notify?: (this: CrudRequest, data: any) => Promise<any>;
        dialog?: (this: CrudRequest, component: any, options?: any) => Promise<any>;
        prompt?: (this: CrudRequest, options?: any) => Promise<any>;
        confirm?: (this: CrudRequest, options?: any) => Promise<any>;
        alert?: (this: CrudRequest, options?: any) => Promise<any>;
        sendRequest?: (this: CrudRequest, options?: RequestOptions) => Promise<any>;
        chooseFile?: (this: CrudRequest, options?: ChooseFileOptions) => Promise<File | File[]>;
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
