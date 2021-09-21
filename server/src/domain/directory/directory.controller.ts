import {
    Body,
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Header,
    HttpStatus,
    HttpCode,
    Res,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DirectoryService } from './directory.service';
import { exists } from '../../common/util';


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
    public async getDirectoryItem(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        const item = await this.directoryService.getDirectoryItemById(id);
        if (!exists(item)) {
            res.status(HttpStatus.NOT_FOUND).send();
            return;
        }

        res.status(HttpStatus.FOUND).json(item).send();
    }

    @Post('directory/:id')
    public async createDirectory(
        @Param('id') id: string,
        @Body() createDirDto: { dirName: string }
    ) {
        const { dirName } = createDirDto;
        const dir = await this.directoryService.createDirectory(id, dirName);
        return dir;
    }

    @Delete('directory/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteDirectory(
        @Param('id') id: string
    ) {
        return this.directoryService.deleteDirectory(id);
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

    @Delete('file/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteFile(
        @Param('id') id: string
    ) {
        return this.directoryService.deleteFile(id);
    }
}