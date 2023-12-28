import { Module } from '@nestjs/common';
import { ServicesModule } from '../../services';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';

@Module({
    imports: [
        ServicesModule
    ],
    controllers: [
        DirectoryController
    ],
    providers: [
        DirectoryService
    ],
    exports: [
        DirectoryService
    ]
})
export class DirectoryModule { }