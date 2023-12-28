import './styles.css';
import { components } from './components';
import { views } from './views';
import { Router, registerComponents } from './common';
import { HttpService } from './services';
import { registerServices } from './helpers';
import * as ko from 'knockout';

(async () => {
    try {
        const rootElem = await bootstrap();
        ko.applyBindings({}, rootElem);
    }
    catch(e){
        console.error('Could not boostrap. Is the server running?');
    }
})();

async function bootstrap(){
    const app = document.getElementById('app');    

    if(!app){
        throw new Error('Could not boostrap. No app element.');
    }

    const registry = registerServices();
    registerComponents(components, registry);
    registerComponents(views, registry);

    ko.bindingEvent.subscribe(app, 'childrenComplete', () => {
        const routerOutlet = document.querySelector('[router-outlet]');
        if(!routerOutlet){
            throw new Error('No outlet defined.')
        }

        const router = registry.getService(Router);        
        router.onRouteLoad.subscribe(route => {
            console.log(route);
            renderView(routerOutlet);
        });
        router.init(routerOutlet).navigateWithUrl();
    });

    // ping the API to make sure it's responding
    const http = registry.getService(HttpService);
    await http.get('/');

    return app;
}
  
/**
 * Render the current view to the router outlet element.
 * 
 * @param outlet Element to render to.
 */
function renderView(outlet:Element){
    const firstChild = outlet.children.item(0);
    if(!firstChild){
        throw new Error('Could not apply bindings to router outlet child');
    }

    ko.applyBindings({}, firstChild);
}

