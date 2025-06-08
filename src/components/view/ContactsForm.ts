import { IEvents } from '../base/events';
import { Form } from './Form';

export class ContactsForm extends Form {
	private inputEmail: HTMLInputElement;
	private inputPhone: HTMLInputElement;

	protected getEventName(): string {
		return 'contacts';
	}

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);

		this.inputEmail = this.formElement.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		this.inputPhone = this.formElement.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		this.inputEmail.addEventListener('input', () => {
			this.events.emit('contacts:setEmail', { email: this.inputEmail.value });
		});
		this.inputPhone.addEventListener('input', () => {
			this.events.emit('contacts:setPhone', { phone: this.inputPhone.value });
		});
	}

	protected handleSubmit(): void {
		this.events.emit('contacts:submit');
	}

	render(): HTMLElement {
		return super.render();
	}
}