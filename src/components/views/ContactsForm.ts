import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

/**
 * @interface IContactsFormData
 * @interface
 * @description Интерфейс данных, представляющий поля формы контактов.
 */

interface IContactsFormData {
  email: string;
  phone: string;
}

/**
 * @class ContactsForm
 * @extends Form<IContactsFormData>
 * @classdesc Форма для ввода контактных данных пользователя (email и телефон).
 * Расширяет абстрактный класс `Form`, добавляя специфичные поля и сеттеры
 * для управления значениями полей email и телефона.
 */

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент формы контактов.
   */

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
