import { IEvents } from '../base/events';
import { Form } from './Form';

export class Order extends Form {
	protected getEventName(): string {
		return 'order';
	}

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);

		const inputAddress = this.formElement.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		inputAddress.addEventListener('input', () => {
			this.events.emit('order:setAddress', { address: inputAddress.value });
		});

		this.buttonAll.forEach((button) => {
			button.addEventListener('click', () => {
				const paymentMethod = button.getAttribute('name') || '';
				this.events.emit('order:setPaymentMethod', { paymentMethod });
				this.buttonAll.forEach((btn) => {
					btn.classList.toggle('button_alt-active', btn === button);
				});
			});
		});
	}

	protected handleSubmit(): void {
		this.events.emit('contacts:open');
	}

	render(): HTMLElement {
		return super.render();
	}
}