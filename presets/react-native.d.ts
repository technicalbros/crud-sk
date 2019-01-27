import { CrudRequest, RequestOptions } from "../src";
declare global {
    interface FormData {
        merge(data: any): this;
    }
    interface URLSearchParams {
        merge(data: any): this;
    }
}
declare function fetchRequest(this: CrudRequest, config: RequestOptions): RequestOptions;
export default fetchRequest;
