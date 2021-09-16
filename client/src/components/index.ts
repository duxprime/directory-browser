
import { ComponentDefinition } from '../common';
import { AppComponentDefiniton } from './app';
import { DirectoryComponentDefinition } from './directory';
import { BreadcrumbsComponentDefiniton} from './breadcrumbs';

export const components:ComponentDefinition[] = [
    AppComponentDefiniton,
    DirectoryComponentDefinition,
    BreadcrumbsComponentDefiniton
];
