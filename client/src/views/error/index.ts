import { ComponentDefinition } from '../../common';
import { ErrorView } from './error.view';
export * from './error.routes';

const errorTemplate = require('./error.template.html');

export const ErrorViewDefinition: ComponentDefinition = {
    name: 'error',
    definition: {
        viewModel: ErrorView,
        template: errorTemplate
    }
};