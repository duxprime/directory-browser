interface DirectoryItemBase {
    id: string;
    dateCreated: string;
    name: string;
    type: 'File' | 'Folder';
    path:string;
    isHome:boolean;
    isRoot:boolean;
    links: {
        parent:string;
        path:string[]
    }
}

export interface File extends DirectoryItemBase {
    type:'File';
    size: number;
    extension: string;
}

export interface Folder extends DirectoryItemBase {
    type:'Folder';
    isRoot: boolean;
    links: {
        parent:string;
        path:string[];
        content:string;
    }
}

export type DirectoryItem = File | Folder;

export interface DirectoryContent {
    items:DirectoryItem[];
    links: {
        parent:string;
    }
}