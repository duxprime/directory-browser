import { appRoutes } from './components/app';
import { homeRoutes } from './views/home';
import { directoryRoutes } from './components/directory';
import { errorRoutes } from './views/error';

export const routes = [
    ...appRoutes,
    ...homeRoutes,
    ...directoryRoutes,
    ...errorRoutes
];