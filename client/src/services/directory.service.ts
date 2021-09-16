import { HttpService } from './http.service';
import { Folder, DirectoryContent, DirectoryItem } from '../dto';

export class DirectoryService{
    constructor(
        private http:HttpService
    ){
    }

    public async getDirectory(id:string){
        const uri = `/directory/${id}`;
        return this.http.get<Folder>(uri);
    }

    public async getDirectoryContent(dir:Folder){
        const { links } = dir;
        return this.http.get<DirectoryContent>(links.content);
    }
    
    public async getDirectoryPath(dir:DirectoryItem){
        const { links } = dir;
        const promises = links.path.map(segmentUri => this.http.get<Folder>(segmentUri));
        return Promise.all(promises);
    }

    public async getParent(dir:DirectoryItem){
        const { links } = dir;

        if(!links.parent){
            return;
        }

        return this.http.get<Folder>(links.parent);
    }

    public async getFile(id:string){
        const uri = `/file/${id}`;

        return this.http.getBinary(uri);
    }
}