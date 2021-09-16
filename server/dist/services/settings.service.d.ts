import { ConfigService } from '@nestjs/config';
interface EnvVars {
    HOME_DIR: string;
}
export declare class SettingsService {
    private config;
    homeDirectory: string;
    constructor(config: ConfigService<EnvVars>);
}
export {};
