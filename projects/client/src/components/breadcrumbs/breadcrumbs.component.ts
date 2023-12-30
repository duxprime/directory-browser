import { ComponentBase, Router } from '../../common';
import { DirectoryService } from '../../services';
import { html, css } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { Folder } from '../../dto';

@customElement('breadcrumb-menu')
export class BreadcrumbsComponent extends ComponentBase {
    @property({
        type: String
    })
    public readonly directoryId!: string;

    @state()
    private path: Folder[] = [];

    private get directoryService() {
        return this.services.getService(DirectoryService);
    }

    private get router() {
        return this.services.getService(Router);
    }

    public async onInit() {
        const dir = await this.directoryService.getDirectory(this.directoryId);
        const segments = await this.directoryService.getDirectoryPath(dir);
        this.path = [
            ...segments,
            dir
        ];
    }

    public navigateToSegment(segment: Folder) {
        this.router.navigate(`/directory/${segment.id}`);
    }

    public render() {
        const breadcrumbs = this.path.map(segment => html`<div class="breadcrumb clickable" 
            title="${segment.name}" @click="${() => this.navigateToSegment(segment)}">
            <div class="underline-hover">${segment.name}</div>
        </div>`);

        return html`<div class="breadcrumb-container">
            ${breadcrumbs}
        </div>`;
    }

    static styles = css`.breadcrumb-container {
        display:flex;
        height:30px;
    }
    
    .breadcrumb {
        float:left;
        max-width: 200px;
    }
    
    .breadcrumb :first-child {
        font-size: 25px;   
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 175px;
        display: inline-block;
        height: 30px;
    }
    
    .breadcrumb::after {
        font-size: 25px;
        content: "/";
    }`;
}

