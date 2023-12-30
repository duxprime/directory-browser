import { RouteDefiniton } from '../../common';
export const errorRoutes: RouteDefiniton[] = [{
    path: '/error',
    getTemplate: params => `<error-view></error-view>`
}];