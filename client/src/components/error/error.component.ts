import { ServiceRegistry, Router } from '../../common';


export class ErrorComponent {
    private get router() {
        return this.services.getService(Router);
    }

    constructor(
        private params: Record<string, string>,
        private services: ServiceRegistry
    ) {
    }

    public goHome() {
        this.router.navigate('/home');
    }
}