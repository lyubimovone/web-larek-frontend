interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

interface IOrderData {
	address?: string;
	email?: string;
	phone?: string;
	payment?: string;
	total?: number;
	items: string[];
}

interface IOrderDataServer {
	address: string;
	email: string;
	phone: string;
	payment: string;
	total: number;
	items: string[];
}

interface IOrderDataResult {
	id: string;
	total: number;
}

interface IBasketModel {
	basket: IProduct[];
	addToBasket(item: IProduct): void;
	removeFromBasket(item: IProduct): void;
	clearBasket(): void;
	getCounter(): number;
	getTotalSumProduct(): number;
	isInBasket(id: string): boolean;
}

interface IOrderForm {
	setAddressForm(value: string): void;
	setOrderForm(field: 'email' | 'phone', value: string): void;
	setPaymentMethod(paymentMethod: string): void;
	validationOrder(): boolean;
	validationContact(): boolean;
	getFormState(): object;
}

interface IBasket {
	basket: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	basketPrice: HTMLElement;
	renderTotalSumProduct(totalSum: number): void;
	render(): HTMLElement;
	button: HTMLButtonElement;
}

interface ISuccess {
	successElement: HTMLElement;
	messageElement: HTMLElement;
	button: HTMLButtonElement;
	render(total: number): HTMLElement;
}

interface ICardPreview {
	text: HTMLElement;
	button: HTMLButtonElement;
	render(item: IProduct): HTMLElement;
}

interface IModal {
	open(): void;
	close(): void;
	render(): HTMLElement;
}

type FormErrorsType = Partial<Record<keyof IOrderDataServer, string>>;

interface IApiClient {
	cdn: string;
	items: IProduct[];
	getProductList(): Promise<IProduct[]>;
	postOrder(order: IOrderData): Promise<IOrderDataResult>;
}

interface IAppData {
	productCards: IProduct[];
	selectedCard: IProduct;
	setPreview(item: IProduct): void;
}

export {
	IProduct,
	IOrderData,
	IOrderDataServer,
	IOrderDataResult,
	IBasketModel,
	IOrderForm,
	IBasket,
	ISuccess,
	ICardPreview,
	IModal,
	FormErrorsType,
	IApiClient,
	IAppData,
};