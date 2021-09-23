import { ComponentDefinition } from '../../common';
import { ErrorComponent } from './error.component';
export * from './error.routes';

const errorTemplate = require('./error.template.html');

export const ErrorComponentDefinition: ComponentDefinition = {
    name: 'error',
    definition: {
        viewModel: ErrorComponent,
        template: errorTemplate
    }
};