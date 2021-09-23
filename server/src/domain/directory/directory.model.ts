import { Stats } from 'fs';
import { StaticIdService } from '../../services';

const FILE_NAME_SEPARATOR = '.';
const PATH_SEPARATOR = '\\';

export abstract class DirectoryItem {
    public readonly id: string = StaticIdService.createId(this.path);
    public readonly dateCreated: Date;
    public abstract readonly name: string;
    public abstract readonly type: 'File' | 'Folder';
    public readonly links = {
        parent: '',
        self: '',
        path: [] as string[]
    }

    constructor(
        /**
         * The absolute path to the item on disk.
         */
        public readonly path: string,
        stats: Stats
    ) {
        this.dateCreated = stats.birthtime;
        this.setLinks();
    }

    private setLinks() {
        const pathSegments = getPathSegments(this.path);
        pathSegments.pop();
        const parentId = StaticIdService.createId(pathSegments.join(PATH_SEPARATOR));
        this.links.parent = pathSegments.length < 1 ? '' : `/directory/${parentId}`;
        this.links.path = this.generatePathLinks(pathSegments);
    }

    private generatePathLinks(segments: string[]) {
        let accumulator = '';
        return segments.map(segment => {
            accumulator += `${segment}${PATH_SEPARATOR}`;
            const id = StaticIdService.createId(accumulator);
            return `/directory/${id}`;
        });
    }
}

export class File extends DirectoryItem {
    public readonly size: number;
    public readonly extension: string;
    public readonly type = 'File'
    public readonly name: string;

    constructor(
        path: string,
        stats: Stats
    ) {
        super(path, stats);
        const item = getPathSegments(path).pop();
        const nameParts = item.split(FILE_NAME_SEPARATOR);
        // get the last one in case of multiple dots
        this.extension = nameParts.pop();
        this.name = nameParts.join(FILE_NAME_SEPARATOR);
        this.size = stats.size;
        this.links.self = `/file/{this.id}`;
    }
}

export class Folder extends DirectoryItem {
    public readonly type = 'Folder';
    public readonly name: string;
    public isRoot: boolean;

    public links = {
        // can't use super here to get correct typing
        ...(this as DirectoryItem).links,
        content: this.isHome ? `/directory/home/content` : `/directory/${this.id}/content`
    };

    constructor(
        path: string,
        stats: Stats,
        public isHome = false
    ) {
        super(path, stats);
        const pathSegments = getPathSegments(path);
        this.isRoot = pathSegments.length === 1;
        this.name = pathSegments.pop();
        this.links.self = `/directory/${this.id}`;
    }
}

/**
 * Factory for creating polymorphic `DirectoryItem` instances.
 */
export function createDirectoryItem(path: string, stats: Stats, isHome?: boolean): DirectoryItem {
    return stats.isFile() ? new File(path, stats) : new Folder(path, stats, isHome);
}

function getPathSegments(path: string) {
    return path.split(PATH_SEPARATOR).filter(segment => segment.length > 0);
}