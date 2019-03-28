import CrudRequest from "./CrudRequest";
import AlertOptions from "./AlertOptions";
import ChooseFileOptions from "./ChooseFileOptions";
import ConfirmOptions from "./ConfirmOptions";
import PromptOptions from "./PromptOptions";
import NotifyOptions from "./NotifyOptions";

export default interface RequestOptions {
    baseUrl?: string,
    callbacks?: {
        loading?: (this: CrudRequest, value: boolean) => void,
        redirect?: (this: CrudRequest, to: any, options?: any) => void,
        reload?: (this: CrudRequest) => void,
        transformParams?: (this: CrudRequest, data: any) => Promise<any>,
        transformResponse?: (this: CrudRequest, data: any) => Promise<any>,
        checkSuccess?: (this: CrudRequest, data: any) => boolean,
        createRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>,
        retrieveRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>,
        updateRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>,
        deleteRequest?: (this: CrudRequest, url: string, data?: any, options?: RequestOptions) => Promise<any>,
        dialog?: (this: CrudRequest, component: any, options?: any) => Promise<any>,
        notify?: (this: CrudRequest, options: NotifyOptions) => Promise<any>,
        alert?: (this: CrudRequest, options?: AlertOptions) => Promise<any>,
        prompt?: (this: CrudRequest, options?: PromptOptions) => Promise<any>,
        confirm?: (this: CrudRequest, options?: ConfirmOptions) => Promise<any>,
        sendRequest?: (this: CrudRequest, options?: RequestOptions) => Promise<any>,
        chooseFile?: (this: CrudRequest, options?: ChooseFileOptions) => Promise<any>
    },
    prefix?: string,
    suffix?: string,
    extension?: string,
    url?: string,
    data?: any,
    redirectTo?: string,
    checkDataType?: boolean,
    showProgress?: boolean,
    notify?: boolean,
    goto?: string,
    reload?: boolean,
    method?: "post" | "get" | "put" | "delete" | string
    ajaxOptions?: any
}
