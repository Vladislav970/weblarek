import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

/**
 * @interface IOrderFormData
 * @interface
 * @description Интерфейс данных, представляющий поля формы оформления заказа.
 */

interface IOrderFormData {
  payment: string;
  address: string;
}

/**
 * @class OrderForm
 * @extends Form<IOrderFormData>
 * @classdesc Форма для оформления заказа. Позволяет пользователю выбрать способ оплаты
 * и указать адрес доставки.
 * Расширяет абстрактный класс `Form`, предоставляя специфичную логику
 * для выбора способа оплаты и установки адреса.
 */

export class OrderForm extends Form<IOrderFormData> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент формы заказа.
   */
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

  /**
   * Устанавливает активный метод оплаты и обновляет стили кнопок.
   * @param {string} value - Название выбранного метода оплаты (должно соответствовать `name` кнопки).
   */
  set payment(value: string) {
    this.paymentButtons.forEach((button) => {
      // Добавляем класс 'button_alt-active' к активной кнопке оплаты и удаляем его у остальных.
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
