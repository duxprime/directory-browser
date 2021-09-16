import { RouteDefiniton } from '../../common';
export const HomeRoute = {
    path:'/',
    getTemplate: () => '<home-view></home-view>'
};

export const homeRoutes:RouteDefiniton[] = [
    HomeRoute
];