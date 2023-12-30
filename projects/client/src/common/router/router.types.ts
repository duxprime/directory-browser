import { exists } from 'utils/functions';

export interface RouteToTemplate<T extends object = Record<string, string>> {
    path: string;
    getTemplate: (params: T) => string;
};

export interface RouteRedirect<T extends object = Record<string, string>> {
    path: string;
    // only support a single level of indirection
    redirect: RouteToTemplate<T>;
};

export type RouteLoadCallback = (path: string) => void;

export type RouteDefiniton<T extends object = Record<string, string>> = RouteToTemplate<T> | RouteRedirect<T>;

export function isRouteRedirect(route: RouteDefiniton): route is RouteRedirect {
    const maybeRedirect = route as RouteRedirect;
    return exists(maybeRedirect) && exists(maybeRedirect.redirect);
}