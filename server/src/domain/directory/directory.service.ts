import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { access, readdir, stat, writeFile } from 'fs/promises';
import { constants, createReadStream } from 'fs';
import { createDirectoryItem, DirectoryItem, Folder } from './directory.model';
import { join, normalize } from 'path';
import { exists } from '../../common';
import { IdService } from '../../services';
import { SettingsService } from '../../services';

@Injectable()
export class DirectoryService {
    constructor(
        private idService: IdService,
        private settings: SettingsService,
        @Inject(CACHE_MANAGER) private cache: Cache
    ) {
    }

    public getHomeDirectory() {
        return this.getDirectoryItemByPath(this.settings.homeDirectory);
    }

    public getHomeDirectoryContent() {
        return this.getDirectoryContentByPath(this.settings.homeDirectory);
    }

    public async getDirectoryItemById(id: string) {
        const item = await this.cache.get<DirectoryItem>(id);
        if (item) {
            return item;
        }

        const path = this.idService.resolveId(id);
        return this.getDirectoryItemByPath(path);
    }

    public async getDirectoryContentById(id: string) {
        const parentItem = await this.cache.get<Folder>(id);

        if (parentItem) {
            const contentIds = await this.cache.get<string[]>(parentItem.path);
            if (contentIds) {
                const items = await Promise.all(contentIds.map(id => this.getDirectoryItemById(id)));

                return {
                    items,
                    links: {
                        parent: parentItem.links.self
                    }
                }
            }
        }

        const path = this.idService.resolveId(id);
        return this.getDirectoryContentByPath(path);
    }

    private async getDirectoryItemByPath(path: string) {
        path = normalizePath(path);
        await tryAcces(path);
        const stats = await stat(path);

        const item = createDirectoryItem(path, stats, path === this.settings.homeDirectory);
        this.cache.set(item.id, item);

        return item;
    }

    private async getDirectoryContentByPath(path: string) {
        path = normalizePath(path);
        await tryAcces(path);
        const files = await readdir(path, {
            withFileTypes: true
        });

        const promises = files.map(async f => {
            const fullPath = normalize(join(path, f.name));

            try {
                const stats = await stat(fullPath);
                const item = createDirectoryItem(fullPath, stats, fullPath === this.settings.homeDirectory);
                this.cache.set(item.id, item);
                return item;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });

        const items = (await Promise.all(promises))
            // filter out empty entries
            .filter(exists);

        // cache the item ids residing at the path
        const ids = items.map(item => item.id);
        this.cache.set(path, ids);

        return {
            items,
            links: {
                parent: `/directory/${this.idService.createId(path)}`
            }
        };
    }

    public getFileById(id: string) {
        const path = this.idService.resolveId(id);
        return this.getFileByPath(path);
    }

    public async getFileByPath(path: string) {
        await tryAcces(path);
        return createReadStream(path);
    }

    public async addFile(id: string, files: Express.Multer.File[]) {
        const path = normalizePath(this.idService.resolveId(id));
        await tryAcces(path);

        const dirItems: DirectoryItem[] = [];
        const cachedContentIds = (await this.cache.get<string[]>(path)) || [];

        for (const file of files) {
            const filename = file.filename || file.originalname;
            const pathWithFileName = normalizePath(`${path}/${filename}`);
            await writeFile(pathWithFileName, file.buffer, 'binary');
            const stats = await stat(pathWithFileName);
            const dirItem = createDirectoryItem(pathWithFileName, stats);
            dirItems.push(dirItem);
            this.cache.set(dirItem.id, dirItem);
            cachedContentIds.push(dirItem.id);
        }

        this.cache.set(path, cachedContentIds);
        return dirItems;
    }
}

function normalizePath(path: string) {
    path = normalize(path);
    // windows adds a trailing period to drive letters
    if (path.charAt(path.length - 1) === '.') {
        path = path.slice(0, path.length - 1);
    }

    return path;
}

async function tryAcces(path) {
    await access(path, constants.R_OK | constants.W_OK);
}