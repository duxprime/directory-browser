import { components } from 'knockout';
import { ServiceRegistry, exists } from '../common';
import * as ko from 'knockout';

export type ViewModel = components.ViewModel;
/**
 * Component lifecycle hook that is called after instantiation.
 */
export interface OnInit extends components.ViewModel {
    onInit(): void | Promise<void>;
}

export interface ViewModelCtor {
    new(params: Record<string, string>, registry: ServiceRegistry): components.ViewModel;
}

export interface ComponentDefinition {
    name: string;
    definition: {
        viewModel?: ViewModelCtor | object;
        template: components.TemplateConfig;
    }
}

export function registerComponents(components: ComponentDefinition[], registry: ServiceRegistry) {
    components.forEach(component => ko.components.register(component.name, component.definition));
    ko.components.loaders.unshift({
        loadViewModel: (name, vm: ViewModelCtor | object, callback) => {
            return callback((params, componentInfo) => {
                const instance = typeof vm === 'object' ? vm : new vm(params, registry);
                if (doesInit(instance)) {
                    instance.onInit();
                }

                return instance;
            });
        }
    });
}

function doesInit(vm: components.ViewModel): vm is OnInit {
    const maybeInits = vm as OnInit;
    return exists(maybeInits) && exists(maybeInits.onInit);
}