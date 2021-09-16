import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServicesModule } from './services';
import { DirectoryModule } from './domain/directory';

@Module({
    imports: [
        ServicesModule,
        DirectoryModule
    ],
    controllers: [AppController]
})
export class AppModule { }
