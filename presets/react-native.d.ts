import { RequestOptions } from "../src";
declare global {
    interface FormData {
        merge(data: any): this;
    }
    interface URLSearchParams {
        merge(data: any): this;
    }
}
export default function (config: RequestOptions): RequestOptions;
