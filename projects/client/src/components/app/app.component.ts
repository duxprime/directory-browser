import { ViewModel } from '../../common';

export class AppComponent implements ViewModel  {
    public readonly title = 'Directory Browser App';

    constructor(
        params:Record<string, string>
    ){
    }

    public dispose(){
    }
}