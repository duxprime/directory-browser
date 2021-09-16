import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { normalize } from 'path';

/**
 * All possible environment variables the settings service may care about exposing.
 */
interface EnvVars {
    HOME_DIR: string;
}

@Injectable()
export class SettingsService {
    public homeDirectory = normalize(this.config.get<string>('HOME_DIR', 'C:'));

    constructor(
        private config: ConfigService<EnvVars>
    ) {
    }
}