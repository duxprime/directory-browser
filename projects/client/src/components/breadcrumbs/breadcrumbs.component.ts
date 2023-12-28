import { ServiceRegistry, OnInit, Router } from '../../common';
import { DirectoryService } from '../../services';
import * as ko from 'knockout';
import { Folder } from '../../dto';

export class BreadcrumbsComponent implements OnInit {    
    private readonly id = this.params.id;
    public readonly path = ko.observableArray([] as Folder[]);

    private get directoryService(){
        return this.services.getService(DirectoryService);
    }
    
    private get router(){
        return this.services.getService(Router);
    }

    constructor(
        private params:Record<string, string>,
        private services:ServiceRegistry
    ){
    }

    public async onInit(){
        const dir = await this.directoryService.getDirectory(this.id);
        const segments = await this.directoryService.getDirectoryPath(dir);
        this.path([
            ...segments,
            dir
        ]);
    }

    public dispose(){
    }

    // use arrow function to maintain 'this' context in template binding
    public navigateToSegment= (segment:Folder) => {
        this.router.navigate(`/directory/${segment.id}`);
    }
}

