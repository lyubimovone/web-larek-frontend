import { IEvents } from '../base/events';
import { IProduct, IAppData } from '../../types';

export class AppData implements IAppData {
	protected _productCards: IProduct[];
	selectedCard: IProduct;

	constructor(protected events: IEvents) {
		this._productCards = [];
	}

	set productCards(data: IProduct[]) {
		this._productCards = data;
		this.events.emit('productCards:receive');
	}

	get productCards() {
		return this._productCards;
	}

	setPreview(item: IProduct) {
		this.selectedCard = item;
		this.events.emit('modalCard:open', item);
	}
}