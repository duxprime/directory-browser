
import { Ctor } from 'utils/types';
import { ServiceRegistry } from 'utils/services';
import { Router } from './common';
import { routes } from './routes';
import {
    DirectoryService,
    HttpService,
    SettingsService,
    HomeService,
    FileService
} from './services';

type ServiceDefinition<T> = [Ctor<T>, T];

const registry = new ServiceRegistry();
ServiceRegistry.init(registry);

const router = new Router(routes);
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

export async function importTemplates() {
    await Promise.all([
        require('./views/error/error.view'),
        require('./views/home/home.view'),
        require('./components/app/app.component'),
        require('./components/directory/directory.component'),
        require('./components/breadcrumbs/breadcrumbs.component')
    ]);
}