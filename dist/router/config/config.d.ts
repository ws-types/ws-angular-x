import { Type, IClass, IGenerator } from "./../../metadata";
import { Observable } from "rxjs/Observable";
export declare const uirouter_stamp = "reflect:ng-module-router-angular-x-v1";
export interface ITreeRoute {
    state?: string;
    parent?: any;
    url: string;
    component?: string;
    redirect?: String;
    loadChildren?: any;
    children?: ITreeRoute[];
    dynamicParams?: string[];
}
export interface Route {
    state?: string;
    parent?: string;
    path?: string;
    pathMatch?: string;
    component?: IClass<any, any> | IGenerator<any> | string;
    redirectTo?: string;
    redirectToPath?: string;
    outlet?: string;
    canActivate?: any[];
    canActivateChild?: any[];
    canDeactivate?: any[];
    canLoad?: any[];
    children?: Routes;
    loadChildren?: LoadChildren;
    params?: string[];
}
export declare type LoadChildren = string | LoadChildrenCallback;
export declare type LoadChildrenCallback = () => Type<any> | Promise<Type<any>> | Observable<Type<any>>;
export declare type Routes = Route[];
