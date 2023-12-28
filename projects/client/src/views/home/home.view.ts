import { ServiceRegistry } from '../../common';

export class HomeView {
    constructor(
        params:Record<string, string>,
        private services:ServiceRegistry
    ){
    }

    public dispose(){
    }
}