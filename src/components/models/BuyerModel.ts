import { IBuyer, ValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private data: Partial<IBuyer> = {};

  constructor(private events: IEvents, initialData?: Partial<IBuyer>) {
    if (initialData) {
      this.data = { ...initialData };
    }
  }

  setData(data: Partial<IBuyer>): void {
    if (!data || typeof data !== "object") {
      throw new Error("Не объект");
    }
    this.data = { ...this.data, ...data };
    this.events.emit("customer:changed");
  }

  getData(): Partial<IBuyer> {
    return { ...this.data };
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.data.address) {
      errors.address = "Укажите адрес";
    }

    if (!this.data.phone) {
      errors.phone = "Укажите телефон";
    }

    if (!this.data.email) {
      errors.email = "Укажите email";
    }

    return errors;
  }

  clear(): void {
    this.data = {};
    this.events.emit("customer:changed");
  }
}
