
import { ComponentDefinition } from '../common';
import { AppComponentDefiniton } from './app';
import { DirectoryComponentDefinition } from './directory';
import { BreadcrumbsComponentDefiniton } from './breadcrumbs';
import { ErrorComponentDefinition } from './error';

export const components: ComponentDefinition[] = [
    AppComponentDefiniton,
    DirectoryComponentDefinition,
    BreadcrumbsComponentDefiniton,
    ErrorComponentDefinition
];
