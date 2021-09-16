/// <reference types="node" />
import { Stats } from 'fs';
export declare abstract class DirectoryItem {
    readonly path: string;
    readonly id: string;
    readonly dateCreated: Date;
    abstract readonly name: string;
    abstract readonly type: 'File' | 'Folder';
    links: {
        parent: string;
        self: string;
        path: any[];
    };
    constructor(path: string, stats: Stats);
    private setLinks;
    private generatePathLinks;
}
export declare class File extends DirectoryItem {
    readonly size: number;
    readonly extension: string;
    readonly type = "File";
    readonly name: string;
    constructor(path: string, stats: Stats);
}
export declare class Folder extends DirectoryItem {
    isHome: boolean;
    readonly type = "Folder";
    readonly name: string;
    isRoot: boolean;
    links: any;
    constructor(path: string, stats: Stats, isHome?: boolean);
}
export declare function createDirectoryItem(path: string, stats: Stats, isHome?: boolean): DirectoryItem;
