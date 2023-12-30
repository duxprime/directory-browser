import { ComponentBase } from '../../common';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('home-view')
export class HomeView extends ComponentBase {
    public render() {
        return html`<h1>Home</h1>
        <directory-browser directoryId="home"></directory-browser>`
    }
}