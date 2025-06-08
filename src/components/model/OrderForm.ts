import { IEvents } from '../base/events';
import { IOrderForm, FormErrorsType } from '../../types';

export class OrderForm implements IOrderForm {
	private address = '';
	private email = '';
	private phone = '';
	private payment = '';
	private errors: FormErrorsType = {};

	constructor(protected events: IEvents) {
		this.validOrder();
		this.validContact();
	}

	setAddressForm(value: string): void {
		this.address = value;
		this.validOrder();
		this.updateOrder();
	}

	setOrderForm(field: string, value: string): void {
		if (field === 'email') {
			this.email = value;
		} else if (field === 'phone') {
			this.phone = value;
		}
		this.validContact();
		this.updateContact();
	}

	setPaymentMethod(paymentMethod: string): void {
		this.payment = paymentMethod;
		this.updateOrder();
	}

	validationOrder(): boolean {
		return !!this.address && !!this.payment;
	}

	validationContact(): boolean {
		return !!this.email && !!this.phone;
	}

	getFormState(): {
		validationOrder: boolean;
		validationContact: boolean;
		data: {
			address: string;
			email: string;
			phone: string;
			payment: string;
		};
	} {
		return {
			validationOrder: this.validationOrder(),
			validationContact: this.validationContact(),
			data: {
				address: this.address,
				email: this.email,
				phone: this.phone,
				payment: this.payment,
			},
		};
	}

	validOrder(): void {
		this.errors = {};
		if (!this.address) {
			this.errors.address = 'Необходимо указать адрес доставки';
		}
		this.events.emit('order:validationErrors', this.errors);
	}

	validContact(): void {
		this.errors = {};
		if (!this.email) {
			this.errors.email = 'Необходимо указать электронную почту';
		}

		if (!this.phone) {
			this.errors.phone = 'Необходимо указать номер телефона';
		}
		this.events.emit('contacts:validationErrors', this.errors);
	}

	updateOrder(): void {
		this.events.emit('order:stateChange', { isValid: this.validationOrder() });
	}

	updateContact(): void {
		this.events.emit('contacts:stateChange', {
			isValid: this.validationContact(),
		});
	}
}