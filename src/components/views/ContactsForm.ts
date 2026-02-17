import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
