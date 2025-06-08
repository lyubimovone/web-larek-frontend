import { IEvents } from '../base/events';
import { IProduct, IBasketModel } from '../../types';

export class BasketModel implements IBasketModel {
	basket: IProduct[];
	events: IEvents;

	constructor(events: IEvents) {
		this.basket = [];
		this.events = events;
	}

	get basketProducts() {
		return this.basket;
	}

	addToBasket(data: IProduct) {
		this.basket.push(data);
		this.events.emit('basket:updated', this.basket);
	}

	removeFromBasket(item: IProduct) {
		const index = this.basket.indexOf(item);

		if (index >= 0) {
			this.basket.splice(index, 1);
			this.events.emit('basket:updated', this.basket);
		}
	}

	clearBasket() {
		this.basket = [];
		this.events.emit('basket:updated', this.basket);
	}

	getCounter() {
		return this.basket.length;
	}

	getTotalSumProduct() {
		return this.basket.reduce((sum, item) => sum + item.price, 0)
	}

	isInBasket(id: string): boolean {
		return this.basket.some((product) => product.id === id);
	}
}