// use declaration merging to get type checking on global object
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
declare global {
    interface Window {
        /**
         * The location of the directory browser API
         */
        apiUri:string;
    }
}

export class SettingsService {
    public apiUri = window.apiUri;

    constructor(){
        if(!this.apiUri){
            throw new Error('Cannot continue. No AP URI provided.');
        }
    }
}