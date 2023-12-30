import './styles.css';
import { Router } from './common';
import { HttpService } from './services';
import { registerServices, importTemplates } from './helpers';
import { AppComponent } from './components/app';

bootstrap();

async function bootstrap() {
    const app = document.getElementById('app');

    if (!app) {
        throw new Error('Could not boostrap. No app element.');
    }

    const registry = registerServices();
    await importTemplates();

    const routerOutlet = await AppComponent.getOutet();
    const router = registry.getService(Router);
    router.subscribeToRouteChange(route => {
        console.log(route);
    });
    router.init(routerOutlet).navigateWithUrl();


    // ping the API to make sure it's responding
    const http = registry.getService(HttpService);
    try {
        await http.get('/');
        return app;
    }
    catch (e) {
        throw new Error('Could not boostrap. Is the server running?');
    }
}

