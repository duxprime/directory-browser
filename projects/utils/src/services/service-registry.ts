import { Ctor } from '../types';


let singleton: ServiceRegistry;
/**
 * Implements a lightweight [service locator](https://en.wikipedia.org/wiki/Service_locator_pattern)
 * in lieu of proper dependency injection.
 */
export class ServiceRegistry {
    static getRegistry() {
        if (!singleton) {
            throw new Error('No singleton ServiceRegistry instance available. Did you initialize?');
        }

        return singleton;
    }

    static init(instance = new ServiceRegistry()) {
        singleton = instance;
    }

    private registry = new WeakMap<Ctor<unknown>, object>();

    public registerService<T extends object>(key: Ctor<T>, instance: T) {
        this.registry.set(key, instance);
    }

    public getService<T extends object>(key: Ctor<T>) {
        const service = this.registry.get(key);
        if (!service) {
            throw new Error(`Could not retrieve service ${key.name}`);
        }

        return service as T;
    }
}
