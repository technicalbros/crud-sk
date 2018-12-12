import { RequestOptions } from "../src";
declare global {
    interface FormData {
        merge(data: any): this;
    }
    interface File {
        url: string;
    }
}
export default function (config: RequestOptions): RequestOptions;
