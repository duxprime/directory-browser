import { ServiceRegistry } from 'utils/services';

export class HomeView {
    constructor(
        params: Record<string, string>,
        private services: ServiceRegistry
    ) {
    }

    public dispose() {
    }
}