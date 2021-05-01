import { AxiosError, AxiosResponse } from "axios";
import { Observable } from "rxjs";
declare type resolveType = (res?: any) => void;
declare type callbackType = (res?: any) => void;
export declare class FormResponse {
    static handleRequest(res: AxiosResponse, resolve: resolveType, callback?: resolveType): void;
    static handleError(res: AxiosError, resolve: resolveType, callback?: callbackType): void;
    static finalFormResponse<T = any>(promise: Observable<AxiosResponse<T>>, callback?: callbackType): Promise<T>;
}
export {};
