import { IProduct } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Page {
    private basketButton: HTMLButtonElement;
    private basketCouter: HTMLElement;
    private pageWrapper: HTMLElement;
    private gallery: HTMLElement;

    constructor(private events: IEvents, coutaiter: HTMLElement) {
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', coutaiter);
        this.basketCouter = ensureElement<HTMLElement>('.header__basket-counter', coutaiter);
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper', coutaiter);
        this.gallery = ensureElement<HTMLElement>('.gallery', coutaiter);
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open')
        })
        this.events.on('basket:updated', (basket: IProduct[]) => {
            this.renderBasketCounter(basket.length);
        })
    }

    renderBasketCounter(value: number): void {
        this.basketCouter.textContent = String(value)
    }

    public set locked(value: boolean) {
        if (value) {
            this.pageWrapper.classList.add('page__wrapper_locked')
        } else {
            this.pageWrapper.classList.remove('page__wrapper_locked')
        }
    }

    appendCard(cardElement: HTMLElement): void {
        this.gallery.appendChild(cardElement)
    }
}