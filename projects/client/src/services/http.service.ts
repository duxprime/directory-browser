import { SettingsService } from './settings.service';

const sharedConfig: RequestInit = {
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
        private settings: SettingsService
    ) {
    }

    public async get<T>(path: string) {
        const uri = this.constructFullPath(path);
        const response = await fetch(uri, createConfig({
            method: 'GET'
        }));

        return guardResponse<T>(response);
    }

    public async getBinary(path: string) {
        const uri = this.constructFullPath(path);
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        return response.blob();
    }


    public async post<T>(path: string, body: Blob | FormData | string | object) {
        const uri = this.constructFullPath(path);
        if (!(body instanceof Blob || body instanceof FormData || typeof body === 'string')) {
            // support arbitrary JSON body
            body = JSON.stringify(body);
        }

        let config: RequestInit = {
            method: 'POST',
            body
        };

        if (!(body instanceof FormData)) {
            config = createConfig(config);
        }

        const response = await fetch(uri, config);
        return guardResponse<T>(response);
    }

    public async delete<T = void>(path: string) {
        const uri = this.constructFullPath(path);
        const response = await fetch(uri, {
            method: 'DELETE'
        });

        return guardResponse<T>(response);
    }

    private constructFullPath(relativePath: string) {
        return `${this.settings.apiUri}${relativePath}`;
    }
}

async function guardResponse<T = void>(resp: Response) {
    switch (resp.status) {
        case 404:
            throw new Error(`Resource not found: ${resp.url}`);
        case 204:
            return {} as T;
        default:
            return await resp.json() as T;
    }
}


function createConfig(partialConfig: RequestInit) {
    return Object.assign({}, sharedConfig, partialConfig);
}