import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtons = Array.from(
      this.container.querySelectorAll("button[name]")
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const formName = this.container.getAttribute("name");
        if (formName) {
          this.events.emit("form:input", {
            field: "payment",
            value: button.name,
            form: formName,
          });
        }
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
