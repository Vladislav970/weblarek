import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @interface IBasketData
 * @interface
 * @description Интерфейс данных, представляющий состояние компонента корзины.
 */
interface IBasketData {
  items: HTMLElement[];
  total: number;
  empty: boolean;
}

/**
 * @class Basket
 * @extends Component<IBasketData>
 * @classdesc Компонент, представляющий корзину товаров.
 * Отображает список добавленных товаров, общую стоимость и кнопку для оформления заказа.
 *
 * @emits 'order:start' при клике на кнопку оформления заказа.
 */

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLUListElement;
  protected totalElement: HTMLElement;
  protected button: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент корзины.
   */

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.button.addEventListener("click", () => {
      // Эмитим событие 'order:start', сигнализируя о начале процесса оформления заказа.
      this.events.emit("order:start");
    });
  }

  /**
   * Устанавливает или обновляет список товаров в корзине.
   * Заменяет существующее содержимое списка новыми элементами.
   * @param {HTMLElement[]} elements - Массив DOM-элементов, представляющих товары.
   */

  set items(elements: HTMLElement[]) {
    this.listElement.replaceChildren(...elements); // ← ПРОСТО ЗАМЕНЯЕМ ДЕТЕЙ
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set empty(value: boolean) {
    this.button.disabled = value;
  }
}
