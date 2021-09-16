/// <reference types="node" />
/// <reference types="multer" />
import { Cache } from 'cache-manager';
import { DirectoryItem } from './directory.model';
import { IdService } from '../../services';
import { SettingsService } from '../../services';
export declare class DirectoryService {
    private idService;
    private settings;
    private cache;
    constructor(idService: IdService, settings: SettingsService, cache: Cache);
    getHomeDirectory(): Promise<DirectoryItem>;
    getHomeDirectoryContent(): Promise<{
        items: DirectoryItem[];
        links: {
            parent: string;
        };
    }>;
    getDirectoryItemById(id: string): Promise<DirectoryItem>;
    getDirectoryContentById(id: string): Promise<{
        items: DirectoryItem[];
        links: {
            parent: any;
        };
    }>;
    private getDirectoryItemByPath;
    private getDirectoryContentByPath;
    getFileById(id: string): Promise<import("fs").ReadStream>;
    getFileByPath(path: string): Promise<import("fs").ReadStream>;
    addFile(id: string, files: Express.Multer.File[]): Promise<DirectoryItem[]>;
}
