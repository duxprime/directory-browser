"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const directory_model_1 = require("./directory.model");
const path_1 = require("path");
const common_2 = require("../../common");
const services_1 = require("../../services");
const services_2 = require("../../services");
let DirectoryService = class DirectoryService {
    constructor(idService, settings, cache) {
        this.idService = idService;
        this.settings = settings;
        this.cache = cache;
    }
    getHomeDirectory() {
        return this.getDirectoryItemByPath(this.settings.homeDirectory);
    }
    getHomeDirectoryContent() {
        return this.getDirectoryContentByPath(this.settings.homeDirectory);
    }
    async getDirectoryItemById(id) {
        const item = await this.cache.get(id);
        if (item) {
            return item;
        }
        const path = this.idService.resolveId(id);
        return this.getDirectoryItemByPath(path);
    }
    async getDirectoryContentById(id) {
        const parentItem = await this.cache.get(id);
        if (parentItem) {
            const contentIds = await this.cache.get(parentItem.path);
            if (contentIds) {
                const items = await Promise.all(contentIds.map(id => this.getDirectoryItemById(id)));
                return {
                    items,
                    links: {
                        parent: parentItem.links.self
                    }
                };
            }
        }
        const path = this.idService.resolveId(id);
        return this.getDirectoryContentByPath(path);
    }
    async getDirectoryItemByPath(path) {
        path = normalizePath(path);
        await tryAcces(path);
        const stats = await (0, promises_1.stat)(path);
        const item = (0, directory_model_1.createDirectoryItem)(path, stats, path === this.settings.homeDirectory);
        this.cache.set(item.id, item);
        return item;
    }
    async getDirectoryContentByPath(path) {
        path = normalizePath(path);
        await tryAcces(path);
        const files = await (0, promises_1.readdir)(path, {
            withFileTypes: true
        });
        const promises = files.map(async (f) => {
            const fullPath = (0, path_1.normalize)((0, path_1.join)(path, f.name));
            try {
                const stats = await (0, promises_1.stat)(fullPath);
                const item = (0, directory_model_1.createDirectoryItem)(fullPath, stats, fullPath === this.settings.homeDirectory);
                this.cache.set(item.id, item);
                return item;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
        const items = (await Promise.all(promises))
            .filter(common_2.exists);
        const ids = items.map(item => item.id);
        this.cache.set(path, ids);
        return {
            items,
            links: {
                parent: `/directory/${this.idService.createId(path)}`
            }
        };
    }
    getFileById(id) {
        const path = this.idService.resolveId(id);
        return this.getFileByPath(path);
    }
    async getFileByPath(path) {
        await tryAcces(path);
        return (0, fs_1.createReadStream)(path);
    }
    async addFile(id, files) {
        const path = normalizePath(this.idService.resolveId(id));
        await tryAcces(path);
        const dirItems = [];
        const cachedContentIds = (await this.cache.get(path)) || [];
        for (const file of files) {
            const filename = file.filename || file.originalname;
            const pathWithFileName = normalizePath(`${path}/${filename}`);
            await (0, promises_1.writeFile)(pathWithFileName, file.buffer, 'binary');
            const stats = await (0, promises_1.stat)(pathWithFileName);
            const dirItem = (0, directory_model_1.createDirectoryItem)(pathWithFileName, stats);
            dirItems.push(dirItem);
            this.cache.set(dirItem.id, dirItem);
            cachedContentIds.push(dirItem.id);
        }
        this.cache.set(path, cachedContentIds);
        return dirItems;
    }
};
DirectoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [services_1.IdService,
        services_2.SettingsService, Object])
], DirectoryService);
exports.DirectoryService = DirectoryService;
function normalizePath(path) {
    path = (0, path_1.normalize)(path);
    if (path.charAt(path.length - 1) === '.') {
        path = path.slice(0, path.length - 1);
    }
    return path;
}
async function tryAcces(path) {
    await (0, promises_1.access)(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
}
//# sourceMappingURL=directory.service.js.map