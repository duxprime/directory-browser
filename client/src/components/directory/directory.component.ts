import { ServiceRegistry, OnInit, Router } from '../../common';
import { DirectoryService, HomeService, FileService, DownloadHandle } from '../../services';
import { DirectoryItem, File, Folder } from '../../dto';
import * as ko from 'knockout';

const usDateFormat = new Intl.DateTimeFormat('en-US');

export class DirectoryComponent implements OnInit {
    public dirName = ko.observable('');
    public items = ko.observableArray([] as DirectoryItem[]);
    public hasParent = ko.observable(false);
    public hasContent = ko.computed(() => this.items().length > 0);
    public countLabel = ko.computed(() => `${this.items().length} items`);

    public readonly id: string = this.params.id;
    private dir!: Folder;
    private handles: DownloadHandle[] = [];

    private get dirService() {
        return this.services.getService(DirectoryService);
    }

    private get fileService() {
        return this.services.getService(FileService);
    }

    private get homeService() {
        return this.services.getService(HomeService);
    }

    private get router() {
        return this.services.getService(Router);
    }

    constructor(
        private params: Record<string, string>,
        private services: ServiceRegistry
    ) {
    }

    public async onInit() {
        this.dir = await this.getDir();
        this.hasParent(this.dir.links.parent.length > 0);
        this.dirName(this.dir.path);

        const { items } = await this.getContent();
        this.items(items);
    }

    // explicitly make this an arrow function to preserve 'this' context in binding
    public selectItem = async (item: DirectoryItem) => {
        const { id } = item;
        if (item.type === 'Folder') {
            this.router.navigate(`/directory/${id}`);
        }
        else {
            this.downloadFile(item);
        }
    }

    public deleteItem = async (item: DirectoryItem, e: Event) => {
        e.stopPropagation();

        const msg = `Are you sure you wish to delete ${item.name}?`;
        if (!confirm(msg)) {
            return;
        };

        this.dirService.deleteItem(item);
        const items = this.items().filter(i => i.id !== item.id);
        this.items(items);
    }

    // explicitly make this an arrow function to preserve 'this' context in binding
    public navigateUp = async () => {
        const parent = await this.dirService.getParent(this.dir);
        if (!parent) {
            return;
        }

        this.router.navigate(`/directory/${parent.id}`);
    };

    public async upload() {
        const files = await this.fileService.displayFilePicker();
        if (!files || files.length < 1) {
            return;
        }

        const uploaded = await this.fileService.upload(this.id, files);
        const items = this.items();
        this.items([
            ...items,
            ...uploaded
        ]);
    }

    public async createFolder() {
        const folderName = prompt('Enter folder name');

        if (!folderName) {
            return;
        }

        const dir = await this.dirService.createDirectory(this.dir, folderName);
        this.items([
            ...this.items(),
            dir
        ]);
    }

    /**
     * Formats a UTC date string as a US date.
     * 
     * @param dateString UTC date string
     * @returns en-US string in MM/DD/YYYY format
     */
    public formatDate(dateString: string) {
        return usDateFormat.format(new Date(dateString));
    }

    /**
     * Convert bytes to megabytes.
     */
    public formatBytes(bytes: number) {
        return (bytes / 1024 / 1024).toFixed(2);
    }

    public dispose() {
        this.handles.forEach(handle => handle.revoke());
    }

    private async getDir() {
        return this.id === 'home' ?
            await this.homeService.getHome() :
            await this.dirService.getDirectory(this.id);
    }

    private async getContent() {
        return this.id === 'home' ?
            await this.homeService.getHomeContent() :
            await this.dirService.getDirectoryContent(this.dir);
    }

    private async downloadFile(file: File) {
        const { name, extension } = file;
        const blob = await this.dirService.getFile(file.id);
        const handle = this.fileService.download(blob, `${name}.${extension}`);
        this.handles.push(handle);
    }
}