import { ensureElement } from '../../utils/utils';

export class Render {
	protected title: HTMLElement;
	protected price: HTMLElement;
	protected color = <Record<string, string>>{
		"дополнительное": "additional",
		"софт-скил": "soft",
		"кнопка": "button",
		"хард-скил": "hard",
		"другое": "other",
	}

	constructor() { }

	protected initElements(context: HTMLElement): void {
		this.title = ensureElement<HTMLElement>('.card__title', context);
		this.price = ensureElement<HTMLElement>('.card__price', context);
	}

	protected setPrice(value: number | null): string {
		return value === null ? 'Бесценно' : `${value} синапсов`;
	}

	renderTitle(title: string): void {
		this.title.textContent = title;
	}

	renderPrice(price: number | null): void {
		this.price.textContent = this.setPrice(price);
	}

}