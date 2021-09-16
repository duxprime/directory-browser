import { RouteDefiniton } from '../../common';
export const directoryRoutes:RouteDefiniton[] =[{
    path: '/directory/:id',
    getTemplate: params => `<directory params="id:'${params.id}'"></directory>`
}];