import { RouteDefiniton } from '../../common';
export const HomeRoute = {
    path: '/home',
    getTemplate: () => '<home-view></home-view>'
};

export const homeRoutes: RouteDefiniton[] = [
    HomeRoute
];