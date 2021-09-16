"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectoryItem = exports.Folder = exports.File = exports.DirectoryItem = void 0;
const services_1 = require("../../services");
const FILE_NAME_SEPARATOR = '.';
const PATH_SEPARATOR = '\\';
class DirectoryItem {
    constructor(path, stats) {
        this.path = path;
        this.id = services_1.StaticIdService.createId(this.path);
        this.links = {
            parent: '',
            self: `/directory/${this.id}`,
            path: []
        };
        this.dateCreated = stats.birthtime;
        this.setLinks();
    }
    setLinks() {
        const pathSegments = getPathSegments(this.path);
        pathSegments.pop();
        const parentId = services_1.StaticIdService.createId(pathSegments.join(PATH_SEPARATOR));
        this.links.parent = pathSegments.length < 1 ? '' : `/directory/${parentId}`;
        this.links.path = this.generatePathLinks(pathSegments);
    }
    generatePathLinks(segments) {
        let accumulator = '';
        return segments.map(segment => {
            accumulator += `${segment}${PATH_SEPARATOR}`;
            const id = services_1.StaticIdService.createId(accumulator);
            return `/directory/${id}`;
        });
    }
}
exports.DirectoryItem = DirectoryItem;
class File extends DirectoryItem {
    constructor(path, stats) {
        super(path, stats);
        this.type = 'File';
        const item = getPathSegments(path).pop();
        const nameParts = item.split(FILE_NAME_SEPARATOR);
        this.extension = nameParts.pop();
        this.name = nameParts.join(FILE_NAME_SEPARATOR);
        this.size = stats.size;
    }
}
exports.File = File;
class Folder extends DirectoryItem {
    constructor(path, stats, isHome = false) {
        super(path, stats);
        this.isHome = isHome;
        this.type = 'Folder';
        this.links = Object.assign(Object.assign({}, this.links), { content: this.isHome ? `/directory/home/content` : `/directory/${this.id}/content` });
        const pathSegments = getPathSegments(path);
        this.isRoot = pathSegments.length === 1;
        this.name = pathSegments.pop();
    }
}
exports.Folder = Folder;
function createDirectoryItem(path, stats, isHome) {
    return stats.isFile() ? new File(path, stats) : new Folder(path, stats, isHome);
}
exports.createDirectoryItem = createDirectoryItem;
function getPathSegments(path) {
    return path.split(PATH_SEPARATOR).filter(segment => segment.length > 0);
}
//# sourceMappingURL=directory.model.js.map