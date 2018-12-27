import { RequestOptions } from "../src";
declare global {
    interface FormData {
        merge(data: any): this;
    }
    interface URLSearchParams {
        merge(data: any): this;
    }
    interface File {
        url: string;
    }
}
export declare function fetchRequest($config: RequestOptions): RequestOptions;
export declare function chooseFile(config: RequestOptions): RequestOptions;
