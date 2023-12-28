import { RouteDefiniton } from '../../common';
import { HomeRoute } from '../../views/home';

const CatchallRoute = {
    path: '*',
    redirect: HomeRoute,
};

const DefaultRoute = {
    path: '/',
    redirect: HomeRoute
};

export const appRoutes: RouteDefiniton[] = [
    CatchallRoute,
    DefaultRoute
];