import * as React from "react";
import { CrudRequest, RequestOptions } from "../src/index";
export declare function notify($config: RequestOptions): RequestOptions;
export declare class NotifySnackBar extends React.Component {
    props: {
        classes?: {
            error_snackbar: string;
            success_snackbar: string;
        };
        crud: CrudRequest;
    };
    state: any;
    hide(): void;
    constructor(props: any);
    render(): JSX.Element;
}
