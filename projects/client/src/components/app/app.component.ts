import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { wait } from 'utils/functions';
import { ComponentBase } from '../../common';

let outlet: Element | undefined;
@customElement('dir-browser-app')
export class AppComponent extends ComponentBase {
    public readonly title = 'Directory Browser App';

    private outletRef: Ref<HTMLDivElement> = createRef();

    public static async getOutet() {
        const maxIterations = 10;
        const iterationWindow = 100;
        let count = 0;

        while (!outlet) {
            if (count > maxIterations) {
                throw new Error('Could not get outlet in a timely manner');
            }

            await wait(iterationWindow);
            count++;
        }

        return outlet;
    }

    protected firstUpdated(): void {
        outlet = this.outletRef.value;
    }

    public render() {
        return html`<div>
            <strong>${this.title}</strong>
            <div ${ref(this.outletRef)}></div>
        </div>`
    }
}