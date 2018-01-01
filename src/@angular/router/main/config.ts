import { Type, IClass, IGenerator } from "@angular";
import { Observable } from "rxjs/Observable";

export interface Route {
    state?: string;
    path?: string;
    pathMatch?: string;
    // matcher?: UrlMatcher;
    component?: IClass<any, any> | IGenerator<any> | string;
    redirectTo?: string;
    outlet?: string;
    canActivate?: any[];
    canActivateChild?: any[];
    canDeactivate?: any[];
    canLoad?: any[];
    // data?: Data;
    // resolve?: ResolveData;
    children?: Routes;
    loadChildren?: LoadChildren;
    // runGuardsAndResolvers?: RunGuardsAndResolvers;
}

export type LoadChildren = string | LoadChildrenCallback;

export type LoadChildrenCallback = () => Type<any> | Promise<Type<any>> | Observable<Type<any>>;

export type Routes = Route[];
