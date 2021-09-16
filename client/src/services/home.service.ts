import { HttpService } from './http.service';
import { DiscoveryDocument, Folder, DirectoryContent } from '../dto';

export class HomeService{
    constructor(
        private http:HttpService
    ){
    }

    public async getHome(){
        const { endpoints } = await this.discover();
        return this.http.get<Folder>(endpoints.home);
    }

    public async getHomeContent(){
        const { links } = await this.getHome();
        return this.http.get<DirectoryContent>(links.content);
    }

    private discover(){
        return this.http.get<DiscoveryDocument>('/discover');
    }
}