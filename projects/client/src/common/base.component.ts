import { LitElement, adoptStyles } from 'lit';
import { ServiceRegistry } from 'utils/services';
import { exists, coerceToArray } from 'utils/functions';
import baseStyles from '../styles/global.css';

export abstract class ComponentBase extends LitElement {
    protected get services() {
        return ServiceRegistry.getRegistry();
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.renderRoot && this.renderRoot instanceof ShadowRoot) {
            if (!baseStyles) {
                throw new Error('Could not load base style sheet.');
            }

            const subclass = Object.getPrototypeOf(this).constructor;
            const subclassStyles = exists(subclass.styles) ? coerceToArray(subclass.styles) : [];
            adoptStyles(this.renderRoot, [
                baseStyles,
                ...subclassStyles
            ]);
        }
    }
}