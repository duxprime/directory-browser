import { AppComponent } from './app.component';
import { ComponentDefinition} from '../../common';
export * from './app.routes';

const appTemplate = require('./app.template.html');

export const AppComponentDefiniton:ComponentDefinition = {
    name: 'map-large-app',
    definition: {
        viewModel: AppComponent,
        template: appTemplate
    }
};