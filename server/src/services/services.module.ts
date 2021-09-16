import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';
import { IdService } from './id.service';

@Module({
    imports: [
        CacheModule.register({
            ttl: null,
            max: 100
        }),
        ConfigModule.forRoot({
            cache: true
        })
    ],
    providers: [
        SettingsService,
        IdService
    ],
    exports: [
        SettingsService,
        IdService,
        CacheModule
    ]
})
export class ServicesModule {
}