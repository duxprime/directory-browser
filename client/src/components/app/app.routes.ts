import { RouteDefiniton } from '../../common';
import { HomeRoute } from '../../views/home';

const DefaultRoute = {
    path: '*',
    redirect: HomeRoute
};

export const appRoutes:RouteDefiniton[] = [
    DefaultRoute
];