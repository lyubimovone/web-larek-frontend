import { IEvents } from '../base/events';
import {
	createElement,
	cloneTemplate,
	ensureElement,
} from '../../utils/utils';
import { IBasket } from '../../types';

export class Basket implements IBasket {
	basket: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	basketPrice: HTMLElement;
	button: HTMLButtonElement;

	constructor(
		template: string | HTMLTemplateElement,
		protected events: IEvents
	) {
		this.basket = cloneTemplate<HTMLElement>(template);
		this.title = ensureElement<HTMLElement>('.modal__title', this.basket);
		this.basketList = ensureElement<HTMLElement>('.basket__list', this.basket);
		this.basketPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.basket
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.basket
		);

		this.button.addEventListener('click', () => {
			this.events.emit('order:open');
			this.clearBasket();
		});
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this.basketList.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })
			);
			this.button.setAttribute('disabled', 'disabled');
		}
	}

	clearBasket(): void {
		this.items = [];
		this.renderTotalSumProduct(0);
		this.events.emit('basket:clear');
	}

	renderTotalSumProduct(totalSum: number): void {
		this.basketPrice.textContent = `${totalSum} синапсов`;
	}

	render(): HTMLElement {
		return this.basket;
	}
}