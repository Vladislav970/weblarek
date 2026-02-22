import { IBuyer, ValidationErrors } from "../../types";
import { EventEmitter, IEvents } from "../base/Events";

const ERROR_TEXT = {
  payment: "Выберите способ оплаты",
  address: "Укажите адрес доставки",
  phone: "Укажите телефон",
  email: "Укажите email",
} as const;

export class BuyerModel {
  private state: Partial<IBuyer>;
  private readonly events: IEvents;

  constructor(initial: Partial<IBuyer> = {}, events: IEvents = new EventEmitter()) {
    this.state = { ...initial };
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    this.state = { ...this.state, ...data };
    this.events.emit("buyer:changed");
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
    if (Object.keys(this.state).length === 0) {
      return;
    }

    this.state = {};
    this.events.emit("buyer:changed");
  }
}
