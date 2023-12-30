import { RouteDefiniton } from '../../common';
export const directoryRoutes: RouteDefiniton[] = [{
    path: '/directory/:id',
    getTemplate: params => `<directory-browser directoryId="'${params.id}'"></directory-browser>`
}];