import { IProduct } from '../../types';
import { Render } from './Render';
import { ensureElement } from '../../utils/utils';

export class Card extends Render {
	cardElement: HTMLElement;
	category: HTMLElement;
	image: HTMLImageElement;

	protected color = <Record<string, string>> {
		"дополнительное": "additional",
		"софт-скил": "soft",
		"кнопка": "button",
		"хард-скил": "hard",
		"другое": "other",
	}

	constructor(template: HTMLTemplateElement, openModal: () => void) {
		super();

		this.cardElement = template.content
			.querySelector('.card')!
			.cloneNode(true) as HTMLElement;
		this.category = ensureElement<HTMLElement>('.card__category', this.cardElement);
		this.image = ensureElement<HTMLImageElement>('.card__image', this.cardElement);
		this.initElements(this.cardElement);

		const cardButton = this.cardElement.querySelector('.card__button');
		if (cardButton) {
			cardButton.addEventListener('click', openModal);
		} else {
			this.cardElement.addEventListener('click', openModal);
		}
	}

	set cardCategory(value: string) {
		this.renderTitle(value);
		this.category.className = `card__category card__category_${this.color[value]}`
	}

	render(item: IProduct): HTMLElement {
		this.category.textContent = item.category;
		this.cardCategory = item.category
		this.image.src = item.image;
		this.image.alt = item.title;
		this.renderTitle(item.title);
		this.renderPrice(item.price);
		return this.cardElement;
	}
}