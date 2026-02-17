import { IBuyer, ValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

const ERROR_TEXT = {
  payment: "Выберите способ оплаты",
  address: "Укажите адрес доставки",
  phone: "Укажите телефон",
  email: "Укажите email",
} as const;

export class BuyerModel {
  private state: Partial<IBuyer>;

  constructor(private readonly events: IEvents, initial: Partial<IBuyer> = {}) {
    this.state = { ...initial };
  }

  setData(data: Partial<IBuyer>): void {
    this.state = { ...this.state, ...data };
    this.events.emit("customer:changed");
  }

  getData(): Partial<IBuyer> {
    return { ...this.state };
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.state.payment) {
      errors.payment = ERROR_TEXT.payment;
    }

    if (!this.state.address?.trim()) {
      errors.address = ERROR_TEXT.address;
    }

    if (!this.state.phone?.trim()) {
      errors.phone = ERROR_TEXT.phone;
    }

    if (!this.state.email?.trim()) {
      errors.email = ERROR_TEXT.email;
    }

    return errors;
  }

  clear(): void {
    this.state = {};
    this.events.emit("customer:changed");
  }
}
