import { RouteLoadCallback, RouteRedirect, RouteDefiniton, RouteToTemplate, isRouteRedirect } from './router.types';
/**
 * Delimitter used to separate path segments.
 */
const ROUTE_DELIMITTER = '/';
/**
 * Prefix used in path segments to denote a parameter.
 */
const PARAM_PREFIX = ':';
/**
 * Character denoting a catch-all fallback route.
 */
const WILD_CARD_ROUTE = '*';

/**
 * Rudimentary client-side routing utility.
 * Supports parameterized routes.
 */
export class Router {
    private routeLoadSubs: RouteLoadCallback[] = [];
    private outletElement?: Element;
    private defaultRoute?: RouteToTemplate;

    constructor(
        private routes: RouteDefiniton[]
    ) {
        this.setDefaultRoute();
    }

    public init(outletElement: Element) {
        this.outletElement = outletElement;
        window.addEventListener('popstate', event => {
            this.navigateWithUrl();
        });

        return this;
    }

    public navigate(path: string, replace = false) {
        const match = this.tryMatchRoute(path);
        if (!match) {
            if (this.defaultRoute) {
                return this.navigateToRoute(this.defaultRoute.path, this.defaultRoute, {}, true);
            }

            throw new Error(`Invalid route: ${path}`);
        }

        const { route, params } = match;

        this.navigateToRoute(path, route, params, replace);
    }

    /**
     * Navigate using current URL as the route.
     */
    public navigateWithUrl() {
        this.navigate(window.location.pathname, true);
    }

    public subscribeToRouteChange(sub: RouteLoadCallback) {
        this.routeLoadSubs.push(sub);
    }

    private navigateToRoute(path: string, route: RouteToTemplate, params: Record<string, string>, replace = false) {
        if (!this.outletElement) {
            throw new Error('No outlet to render to. Call init() first.');
        }

        if (replace) {
            history.replaceState(params, '', path);
        }
        else {
            history.pushState(params, '', path);
        }

        this.outletElement.innerHTML = route.getTemplate(params);
        this.onRouteLoad(path);
    }

    private onRouteLoad(path: string) {
        this.routeLoadSubs.forEach(notify => notify(path));
    }

    /**
     * Given a URL path, attempting to find a matching route defintion.
     * 
     * @param path A relative path beginning with a `'/'`
     * @returns A route definition, if one exists.
     */
    private tryMatchRoute(path: string) {
        const segments = extractSegments(path, ROUTE_DELIMITTER);
        if (segments.length < 1) {
            return;
        }

        const match = this.routes.find(route => {
            const routeSegments = extractSegments(route.path, ROUTE_DELIMITTER);

            if (segments.length !== routeSegments.length) {
                return false;
            }

            return segments.every((s, i) => {
                const routeSegment = routeSegments[i];
                return s === routeSegment || routeSegment.startsWith(PARAM_PREFIX);
            });
        });

        if (!match) {
            return;
        }

        const params = extractParams(extractSegments(match.path, ROUTE_DELIMITTER), segments, PARAM_PREFIX)

        return {
            route: isRouteRedirect(match) ? match.redirect : match,
            params
        };
    }

    private setDefaultRoute() {
        const defaultRouteIndex = this.routes.findIndex(r => isRouteRedirect(r) && r.path === WILD_CARD_ROUTE);
        if (!defaultRouteIndex) {
            if (defaultRouteIndex < 0) {
                return;
            }

            this.defaultRoute = (this.routes[defaultRouteIndex] as RouteRedirect).redirect;
            this.routes.splice(defaultRouteIndex, 1);
        }
    }
}

function extractSegments(path: string, delimitter: string) {
    // assume route begins with the delimitter; discard first segment
    return path.split(delimitter).slice(1);
}

function extractParams(routeSegments: string[], urlSegments: string[], prefix: string) {
    return routeSegments.reduce((params, segment, i) => {
        if (segment.startsWith(prefix)) {
            const propName = segment.slice(1);
            params[propName] = urlSegments[i];
        }

        return params;
    }, {} as Record<string, string>);
}
