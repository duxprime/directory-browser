/// <reference types="multer" />
import { Response } from 'express';
import { DirectoryService } from './directory.service';
export declare class DirectoryController {
    private directoryService;
    constructor(directoryService: DirectoryService);
    getHomeDir(): Promise<import("./directory.model").DirectoryItem>;
    getHomeContent(): Promise<{
        items: import("./directory.model").DirectoryItem[];
        links: {
            parent: string;
        };
    }>;
    getDirectoryItem(id: string): Promise<import("./directory.model").DirectoryItem>;
    getContentForId(id: string): Promise<{
        items: import("./directory.model").DirectoryItem[];
        links: {
            parent: any;
        };
    }>;
    uploadFile(id: string, files: Express.Multer.File[]): Promise<import("./directory.model").DirectoryItem[]>;
    getFileById(id: string, resp: Response): Promise<Response<any, Record<string, any>>>;
}
