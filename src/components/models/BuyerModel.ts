import { IBuyer, ValidationErrors } from "../../types";
import { IEvents } from "../base/Events";
/**
 * Модель для работы с данными покупателя
 * Отвечает за хранение и валидацию данных заказа
 * @emits 'customer:changed' при изменении данных покупателя
 */
export class BuyerModel {
  private data: Partial<IBuyer> = {};

  /**
   * Создает экземпляр модели покупателя
   * @param initialData - начальные данные покупателя (опционально)
   * Можно передать часть полей, остальные будут не заполнены
   * @example
   * new CustomerModel({ email: 'test@mail.ru', phone: '+79991234567' })
   */
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

  /**
   * Валидирует данные покупателя
   * @returns объект с ошибками валидации
   * Если поле валидно, оно отсутствует в объекте
   */
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
