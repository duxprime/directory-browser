import { SettingsService } from './services';
interface DiscoveryDocument {
    homeDirectory: string;
    endpoints: {
        home: string;
    };
}
export declare class AppController {
    private readonly settings;
    constructor(settings: SettingsService);
    getStatus(): {};
    getHomeDir(): DiscoveryDocument;
}
export {};
