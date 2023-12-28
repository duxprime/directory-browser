import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SettingsService } from './services';

/**
 * Document containing bootstrap information for clients.
 */
interface DiscoveryDocument {
  homeDirectory: string;
  endpoints: {
    home: string;
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly settings: SettingsService
  ) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getStatus() {
    return {};
  }

  @Get('/discover')
  getHomeDir(): DiscoveryDocument {
    const { homeDirectory } = this.settings;

    return {
      homeDirectory,
      endpoints: {
        home: '/directory/home'
      }
    }
  }
}
