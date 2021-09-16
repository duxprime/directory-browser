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
exports.DirectoryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const directory_service_1 = require("./directory.service");
let DirectoryController = class DirectoryController {
    constructor(directoryService) {
        this.directoryService = directoryService;
    }
    getHomeDir() {
        return this.directoryService.getHomeDirectory();
    }
    getHomeContent() {
        return this.directoryService.getHomeDirectoryContent();
    }
    getDirectoryItem(id) {
        return this.directoryService.getDirectoryItemById(id);
    }
    getContentForId(id) {
        return this.directoryService.getDirectoryContentById(id);
    }
    uploadFile(id, files) {
        return this.directoryService.addFile(id, files);
    }
    async getFileById(id, resp) {
        const stream = await this.directoryService.getFileById(id);
        return stream.pipe(resp);
    }
};
__decorate([
    (0, common_1.Get)('directory/home'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DirectoryController.prototype, "getHomeDir", null);
__decorate([
    (0, common_1.Get)('directory/home/content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DirectoryController.prototype, "getHomeContent", null);
__decorate([
    (0, common_1.Get)('directory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DirectoryController.prototype, "getDirectoryItem", null);
__decorate([
    (0, common_1.Get)('directory/:id/content'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DirectoryController.prototype, "getContentForId", null);
__decorate([
    (0, common_1.Post)('directory/:id/files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 10)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], DirectoryController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('file/:id'),
    (0, common_1.Header)('Content-Type', 'application/octet-stream'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "getFileById", null);
DirectoryController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [directory_service_1.DirectoryService])
], DirectoryController);
exports.DirectoryController = DirectoryController;
//# sourceMappingURL=directory.controller.js.map