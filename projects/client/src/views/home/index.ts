import { ComponentDefinition} from '../../common';
import { HomeView } from './home.view';
export * from './home.routes';

const homeTemplate = require('./home.template.html');

export const HomeViewDefinition:ComponentDefinition = {
    name :'home-view',
    definition: {
        viewModel: HomeView,
        template: homeTemplate
    }
};