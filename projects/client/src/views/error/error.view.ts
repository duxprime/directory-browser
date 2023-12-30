import { ServiceRegistry } from 'utils/services';
import { ComponentBase, Router } from '../../common';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('error-view')
export class ErrorView extends ComponentBase {
    private get router() {
        return ServiceRegistry.getRegistry().getService(Router);
    }

    private goHome() {
        this.router.navigate('/home');
    }

    public render() {
        return html`<div class="centered full-width">
            <h1>404</h1>
            <h2>Directory not found</h2>
            <a href="javascript:void" @click="${() => this.goHome()}">Home</a>
        </div>`;
    }
}