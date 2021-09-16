import {
    Controller,
    Get,
    Post,
    Param,
    Header,
    Res,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DirectoryService } from './directory.service';

@Controller()
export class DirectoryController {
    constructor(
        private directoryService: DirectoryService
    ) {
    }

    @Get('directory/home')
    public getHomeDir() {
        return this.directoryService.getHomeDirectory();
    }

    @Get('directory/home/content')
    public getHomeContent() {
        return this.directoryService.getHomeDirectoryContent();
    }

    @Get('directory/:id')
    public getDirectoryItem(
        @Param('id') id: string
    ) {
        return this.directoryService.getDirectoryItemById(id);
    }

    @Get('directory/:id/content')
    public getContentForId(
        @Param('id') id: string
    ) {
        return this.directoryService.getDirectoryContentById(id);
    }

    @Post('directory/:id/files')
    @UseInterceptors(FilesInterceptor('files[]', 10))
    public uploadFile(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.directoryService.addFile(id, files);
    }

    @Get('file/:id')
    @Header('Content-Type', 'application/octet-stream')
    public async getFileById(
        @Param('id') id: string,
        @Res() resp: Response
    ) {
        const stream = await this.directoryService.getFileById(id);

        return stream.pipe(resp);
    }
}