import { IProduct, ICardPreview } from '../../types';
import { IEvents } from '../base/events';
import { Card } from './Card';

export class CardPreview extends Card implements ICardPreview {
	text: HTMLElement;
	button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template, () => this.handleAddToBasket());
		this.text = this.cardElement.querySelector('.card__text');
		this.button = this.cardElement.querySelector('.card__button');
	}

	private handleAddToBasket(): void {
		if (!this.button.disabled) {
			this.events.emit('card:addBasket');
		}
	}

	private getButtonLabel(item: IProduct, isInBasket: boolean): string {
		if (item.price === null) {
			return 'Не продаеться';
		}
		if (isInBasket) {
			return 'В корзине';
		}
		return 'Купить';
	}

	render(item: IProduct): HTMLElement {
		this.category.textContent = item.category;
		this.cardCategory = item.category
		this.image.src = item.image;
		this.image.alt = item.title;
		this.text.textContent = item.description;
		this.renderTitle(item.title);
		this.renderPrice(item.price);
		let isInBasket = false;
		this.events.emit('basket:check', {
			id: item.id,
			callback: (res: boolean) => {
				isInBasket = res;
			},
		});
		this.button.textContent = this.getButtonLabel(item, isInBasket);
		this.button.disabled = item.price === null || isInBasket;

		return this.cardElement;
	}
}