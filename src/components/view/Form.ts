import { IEvents } from '../base/events';
import {
	ensureAllElements,
	ensureElement,
	cloneTemplate,
} from '../../utils/utils';
import { FormErrorsType } from '../../types';

export abstract class Form {
	formElement: HTMLElement;
	InputAll: HTMLInputElement[];
	buttonAll: HTMLButtonElement[];
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.formElement = cloneTemplate(template);
		this.InputAll = ensureAllElements(
			'.form__input',
			this.formElement
		) as HTMLInputElement[];
		this.buttonAll = ensureAllElements(
			'.button_alt',
			this.formElement
		) as HTMLButtonElement[];
		this.buttonSubmit = ensureElement(
			'.button',
			this.formElement
		) as HTMLButtonElement;
		this.formErrors = ensureElement('.form__errors', this.formElement);
		this.addInputListener();
		this.addSubmitListener();
	}

	protected addInputListener(): void {
		this.InputAll.forEach(input => {
			input.addEventListener('input', () => {
				this.onInputChange();
			});
		});
	}

	protected addSubmitListener(): void {
		this.formElement.addEventListener('submit', (ev: Event) => {
			ev.preventDefault();
			this.handleSubmit();
		});
	}

	protected onInputChange(): void {
		this.events.emit(`${this.getEventName()}:changed`);
	}

	protected abstract handleSubmit(): void;
	protected abstract getEventName(): string;

	set isValid(value: boolean) {
		this.buttonSubmit.disabled = !value;
	}

	displayErrors(errors: FormErrorsType): void {
		this.formErrors = ensureElement('.form__errors', this.formElement);
		this.formErrors.innerHTML = '';
		Object.values(errors).forEach((err) => {
			const errorElement = document.createElement('p');
			errorElement.textContent = err;
			this.formErrors.appendChild(errorElement);
		});
	}

	render(): HTMLElement {
		return this.formElement;
	}
}