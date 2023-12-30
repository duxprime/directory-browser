import { LitElement } from 'lit';
import { ServiceRegistry } from 'utils/services';

export abstract class ComponentBase extends LitElement {
    protected get services() {
        return ServiceRegistry.getRegistry();
    }
}