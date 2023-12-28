
import { Ctor } from 'utils/types';
import { ServiceRegistry } from 'utils/services';
import { Router } from './common';
import { appRoutes } from './components/app';
import { homeRoutes } from './views/home';
import { directoryRoutes } from './components/directory';
import { errorRoutes } from './views/error';
import {
    DirectoryService,
    HttpService,
    SettingsService,
    HomeService,
    FileService
} from './services';

const routes = [
    ...appRoutes,
    ...homeRoutes,
    ...directoryRoutes,
    ...errorRoutes
];
type ServiceDefinition<T> = [Ctor<T>, T];
const router = new Router(routes);
const registry = new ServiceRegistry();
const settings = new SettingsService();
const http = new HttpService(settings);
const home = new HomeService(http);
const dir = new DirectoryService(http);
const file = new FileService(http);

const services: ServiceDefinition<object>[] = [
    [Router, router],
    [SettingsService, settings],
    [HttpService, http],
    [HomeService, home],
    [DirectoryService, dir],
    [FileService, file]
];

export function registerServices() {
    services.forEach(([type, instance]) => {
        registry.registerService(type, instance);
    });

    return registry;
}