import { IBuyer, ValidationErrors } from "../../types";
import { EventEmitter, IEvents } from "../base/Events";

const ERROR_TEXT = {
  payment: "Выберите способ оплаты",
  address: "Укажите адрес доставки",
  phone: "Укажите телефон",
  email: "Укажите email",
} as const;

const INITIAL_STATE: IBuyer = {
  payment: "" as IBuyer["payment"],
  address: "",
  phone: "",
  email: "",
};

export class BuyerModel {
  private state: IBuyer = { ...INITIAL_STATE };
  private readonly events: IEvents;

  constructor(initial: Partial<IBuyer> = {}, events: IEvents = new EventEmitter()) {
    this.state = { ...INITIAL_STATE, ...initial };
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    this.state = { ...this.state, ...data };
    this.events.emit("buyer:changed");
  }

  getData(): IBuyer {
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
    const isInitialState =
      this.state.payment === INITIAL_STATE.payment &&
      this.state.address === INITIAL_STATE.address &&
      this.state.phone === INITIAL_STATE.phone &&
      this.state.email === INITIAL_STATE.email;

    if (isInitialState) {
      return;
    }

    this.state = { ...INITIAL_STATE };
    this.events.emit("buyer:changed");
  }
}
