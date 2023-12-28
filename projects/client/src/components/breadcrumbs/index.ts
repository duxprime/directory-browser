import { BreadcrumbsComponent } from './breadcrumbs.component';
import { ComponentDefinition} from '../../common';
require('./breadcrumbs.styles.css');
const template = require('./breadcrumbs.template.html');

export const BreadcrumbsComponentDefiniton:ComponentDefinition = {
    name: 'breadcrumbs',
    definition: {
        viewModel: BreadcrumbsComponent,
        template
    }
};