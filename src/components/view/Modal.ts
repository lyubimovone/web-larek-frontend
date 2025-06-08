import { IEvents } from "../base/events";
import { ensureElement, isBoolean } from "../../utils/utils";
import { IModal } from "../../types";

export class Modal implements IModal {
    modal: HTMLElement;
    content: HTMLElement;
    closeButton: HTMLButtonElement;

    constructor(modalElement: HTMLElement | string, protected events: IEvents) {
        this.modal = ensureElement(modalElement);
        this.content = ensureElement('.modal__content', this.modal);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.modal);

        this.modal.addEventListener('click', this.close.bind(this))
        this.closeButton.addEventListener('click', this.close.bind(this))
        ensureElement('.modal__container', this.modal).addEventListener('click', (ev) => {
            ev.stopPropagation()
        })
    }

    open(): void {
        this.modal.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.modal.classList.remove('modal_active')
        this.setContent(null)
        this.events.emit('modal:close');
    }

    setContent(value: HTMLElement) {
        this.content.replaceChildren(value);
    }

    render(): HTMLElement {
        this.content;
        this.open()
        return this.modal
    }
}