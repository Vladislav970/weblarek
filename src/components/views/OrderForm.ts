import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  private readonly paymentButtons: HTMLButtonElement[];
  private readonly addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>("button[name]")
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("form:input", {
          field: "payment",
          value: button.name,
        });
      });
    });
  }

  set payment(value: string) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
