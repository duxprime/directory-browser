import { ComponentDefinition} from '../../common';
import { DirectoryComponent } from './directory.component';
export * from './directory.routes';

const directoryTemplate = require('./directory.template.html');

export const DirectoryComponentDefinition:ComponentDefinition = {
    name :'directory',
    definition: {
        viewModel: DirectoryComponent,
        template: directoryTemplate
    }
};