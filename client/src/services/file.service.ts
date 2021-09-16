import { HttpService } from '../services';
import { File } from '../dto';

export interface DownloadHandle {
    revoke:()=>void;
}

export class FileService {
    constructor(
        private http:HttpService
    ){
    }

    public displayFilePicker(){
        const input = document.createElement('input');
        let resolveCallback:((files:FileList|null) => void)|undefined;
        const promise = new Promise<FileList|null>((resolve, reject) => {
            resolveCallback = resolve;
        });

        input.setAttribute('type', 'file');
        input.setAttribute('multiple', 'multiple');
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', () => {
            const { files } = input;

            if(resolveCallback){
                resolveCallback(files);
                resolveCallback = undefined;
            }
        });
        input.click();
        input.remove();

        return promise;
    }

    public upload(dirId:string, files:FileList){
        const formData = new FormData();
        const filesArr = Array.from(files);
        filesArr.forEach(file => {
            formData.append('files[]', file);
        });

        return this.http.post<File[]>(`/directory/${dirId}/files`, formData);
    }

    public download(data:Blob, filename:string){
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();    
        a.remove();

        const handle:DownloadHandle = {
            revoke: () => window.URL.revokeObjectURL(url)
        };

        return handle;
    }
}