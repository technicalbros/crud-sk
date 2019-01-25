export interface RequestOptions {
    baseUrl?: string,
    callbacks?: {
        loading?: (value: boolean) => void,
        redirect?: (to: any, data?: any) => void,
        reload?: () => void,
        createRequest?: () => void,
        checkSuccess?: (data: any) => boolean,
        notify?: (this: CrudRequest, data: any) => Promise<any>,
        dialog?: (this: CrudRequest, component: any, options: any) => Promise<any>,
        prompt?: (this: CrudRequest, options: any) => Promise<any>,
        confirm?: (this: CrudRequest, options: any) => Promise<any>,
        alert?: (this: CrudRequest, options: any) => Promise<any>,
        sendRequest?: (this: CrudRequest, options: RequestOptions) => Promise<any>,
        chooseFile?: (this: CrudRequest, options: ChooseFileOptions) => Promise<File | File[]>
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

export interface ChooseFileOptions {
    accept?: string | string[],
    multiple?: boolean
}

export class CrudRequest {

    $config: RequestOptions = {
        baseUrl: "",
        callbacks: {
            notify: (data) => new Promise((resolve, reject) => {
                alert(data.message);
            }),
            checkSuccess: (data) => {
                if (data.type === 'success') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    config(callback: (this: CrudRequest, config: RequestOptions) => RequestOptions): CrudRequest {
        this.$config = callback.apply(this, [{...this.$config}]);
        return this;
    }

    send(options: RequestOptions): Promise<any> {
        return this.$config.callbacks.sendRequest.apply(this, [options]);
    }

    create(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.send({
            method: "post",
            prefix: "create/",
            ...options,
            url: url,
            data: data,
        })
    }

    update(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.send({
            method: "post",
            prefix: "update/",
            ...options,
            url: url,
            data: data,
        })
    }

    delete(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.send({
            method: "post",
            prefix: "delete/",
            ...options,
            url: url,
            data: data,
        })
    }

    retrieve(url: string, data?: any, options?: RequestOptions): Promise<any> {
        return this.send({
            method: "get",
            prefix: "retrieve/",
            checkDataType: false,
            notify: false,
            ...options,
            url: url,
            data: data,
        })
    }

    redirect(to: any, options: any): void {
        this.$config.callbacks.redirect(to, options);
    }

    alert(options: any): Promise<any> {
        return this.$config.callbacks.alert.apply(this, [options]);
    }

    confirm(options: any): Promise<boolean> {
        return this.$config.callbacks.confirm.apply(this, [options]);
    }

    prompt(options: any): Promise<any> {
        return this.$config.callbacks.prompt.apply(this, [options]);
    }

    dialog(name: string, options: any): Promise<any> {
        return this.$config.callbacks.dialog.apply(this, [name, options]);
    }

    notify(options: any): Promise<any> {
        return this.$config.callbacks.notify.apply(this, [options]);
    }

    toggleLoading(value: boolean): void {
        this.$config.callbacks.loading(value);
    }

    chooseFile(options: ChooseFileOptions = {}): Promise<File | File[]> {
        return this.$config.callbacks.chooseFile.apply(this, [options]);
    }
}