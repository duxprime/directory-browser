import { SettingsService } from './settings.service';

const sharedConfig:RequestInit = {
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * Wraps the underlying HTTP request facilities for
 * cross-cutting concerns and easy mocking.
 */
export class HttpService {
    constructor(
        private settings:SettingsService
    ){
    }

    public async get<T>(path:string){
        const uri = this.constructFullPath(path);
        const response = await fetch(uri,  createConfig({
            method: 'GET'
        }));

        return await response.json() as T;
    }

    public async getBinary(path:string){
        const uri = this.constructFullPath(path);
        const response = await fetch(uri, {
            method: 'GET',
            headers :{
                'Content-Type': 'application/octet-stream'
            }
        });

        return response.blob();
    }


    public async post<T>(path:string, body:BodyInit){
        const uri = this.constructFullPath(path);
        let config:RequestInit = {
            method: 'POST',
            body
        };

        if(!(body instanceof FormData)){
            config = createConfig(config);
        }
        
        const response = await fetch(uri, config);
        return await response.json() as T;
    }

    private constructFullPath(relativePath:string){
        return `${this.settings.apiUri}${relativePath}`;
    }
}

function createConfig(partialConfig:RequestInit){
    return Object.assign({}, sharedConfig, partialConfig);
}