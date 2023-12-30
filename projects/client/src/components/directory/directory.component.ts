import { PropertyValueMap, html, nothing } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { Router, ComponentBase } from '../../common';
import { DirectoryService, HomeService, FileService, DownloadHandle, } from '../../services';
import { DirectoryItem, DirectoryContent, File, Folder } from '../../dto';


const usDateFormat = new Intl.DateTimeFormat('en-US');

@customElement('directory-browser')
export class DirectoryComponent extends ComponentBase {
    @property({
        type: String
    })
    public readonly directoryId!: string;

    @state()
    private dirName = '';

    @state()
    private items: DirectoryItem[] = [];

    @state()
    private hasParent = false;

    private get hasContent() {
        return this.items.length > 0
    };

    private get countLabel() {
        return `${this.items.length} items`
    };


    private directory?: Folder;
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

    public async firstUpdated() {
        if (!this.directoryId) {
            throw new Error('Directory ID required.');
        }

        try {
            this.directory = await this.getDir();
            this.hasParent = this.directory.links.parent.length > 0;
            this.dirName = this.directory.path;

            const { items } = await this.getContent();
            this.items = items;
        }
        catch (e) {
            this.router.navigate('/error');
        }
    }

    public async updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {

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

    private deleteItem(item: DirectoryItem, e: Event) {
        e.stopPropagation();

        const msg = `Are you sure you wish to delete ${item.name}?`;
        if (!confirm(msg)) {
            return;
        };

        this.dirService.deleteItem(item);
        const items = this.items.filter(i => i.id !== item.id);
        this.items = items;
    }

    private async navigateUp() {
        if (!this.directory) {
            throw new Error('Could not nabigate up. No directory data.');
        }

        const parent = await this.dirService.getParent(this.directory);
        if (!parent) {
            return;
        }

        this.router.navigate(`/directory/${parent.id}`);
    };

    private async upload() {
        const files = await this.fileService.displayFilePicker();
        if (!files || files.length < 1) {
            return;
        }

        const uploaded = await this.fileService.upload(this.directoryId, files);
        this.items = [
            ...this.items,
            ...uploaded
        ];
    }

    private async createFolder() {
        if (!this.directory) {
            throw new Error('Could not create folder. No directory data.');
        }

        const folderName = prompt('Enter folder name');
        if (!folderName) {
            return;
        }

        const dir = await this.dirService.createDirectory(this.directory, folderName);
        this.items = [
            ...this.items,
            dir
        ];
    }

    private dispose() {
        this.handles.forEach(handle => handle.revoke());
    }

    public render() {
        const secondaryHeader = this.hasParent ? html`<h3 class="clickable" @click="${() => this.navigateUp()}">↑ Up</h3>` : nothing;
        return html`<breadcrumb-menu directory-id="${this.directoryId}"></breadcrumb-menu>
            <h3>${this.countLabel}</h3>
            ${secondaryHeader}
            <button @click="${() => this.upload()}">Upload</button>
            <button @click="${() => this.createFolder()}">Create Folder</button>
            ${this.renderContent()}
        `;
    }

    private renderContent() {
        if (!this.hasContent) {
            return nothing;
        }

        const rows = this.items.map(i => {
            const { name, dateCreated, type } = i;
            return html`<tr title=${i.path} @click="${() => this.selectItem(i)}" class="clickable highlight-hover">
                <td class="align-left">${name}</td>
                <td class="align-right">${formatDate(dateCreated)}</td>
                <td class="align-right">${type === 'File' ? i.extension : 'Directory'}</td>
                <td class="align-right">${type === 'File' ? formatBytes(i.size) : ''}</td>
                <td class="align-right bold clickable" @click="${(e: Event) => this.deleteItem(i, e)}">X</td>
            </tr>`;
        });

        return html`<table class="full-width">
            <thead>
                <tr>
                    <th class="align-left">Name</th>
                    <th class="align-right">Created</th>
                    <th class="align-right">Type</th>
                    <th class="align-right">Size (MB)</th>
                    <th class="align-right">Delete</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>`;
    }

    private async getDir() {
        return this.directoryId === 'home' ?
            await this.homeService.getHome() :
            await this.dirService.getDirectory(this.directoryId);
    }

    private getContent(): Promise<DirectoryContent> {
        if (this.directoryId === 'home') {
            return this.homeService.getHomeContent();
        }

        if (this.directory) {
            return this.dirService.getDirectoryContent(this.directory)
        }

        return Promise.resolve({
            items: [],
            links: {
                parent: '',
            }
        });
    }

    private async downloadFile(file: File) {
        const { name, extension } = file;
        const blob = await this.dirService.getFile(file.id);
        const handle = this.fileService.download(blob, `${name}.${extension}`);
        this.handles.push(handle);
    }
}

/**
 * Formats a UTC date string as a US date.
 * 
 * @param dateString UTC date string
 * @returns en-US string in MM/DD/YYYY format
 */
function formatDate(dateString: string) {
    return usDateFormat.format(new Date(dateString));
}

/**
 * Convert bytes to megabytes.
 */
function formatBytes(bytes: number) {
    return (bytes / 1024 / 1024).toFixed(2);
}