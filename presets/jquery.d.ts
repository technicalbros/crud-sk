import { CrudRequest, RequestOptions } from "../src";
declare global {
    interface FormData {
        merge(data: any): this;
    }
    interface File {
        url: string;
    }
}
export declare function ajaxRequest(this: CrudRequest, config: RequestOptions): RequestOptions;
export default ajaxRequest;
