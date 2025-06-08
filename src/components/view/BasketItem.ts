import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { Render } from './Render';

export class BasketItem extends Render {
	index: HTMLElement;
	basketItem: HTMLElement;
	removeButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, onDelete: () => void) {
		super();

		this.basketItem = document
			.querySelector('.basket__item')!
			.cloneNode(true) as HTMLElement;
		this.index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.basketItem
		);
		this.removeButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.basketItem
		);

		this.initElements(this.basketItem);
		this.removeButton.addEventListener('click', onDelete);
	}

	render(data: IProduct, IndexItem: number): HTMLElement {
		this.index.textContent = String(IndexItem);
		this.renderTitle(data.title);
		this.renderPrice(data.price);
		return this.basketItem;
	}
}