import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @interface IHeader
 * @interface
 * @description Интерфейс данных, представляющий состояние компонента шапки.
 */
interface IHeader {
  counter: number;
}

/**
 * @class Header
 * @extends Component<IHeader>
 * @classdesc Компонент шапки приложения. Отображает счетчик товаров в корзине
 * и предоставляет кнопку для открытия корзины.
 *
 * @emits 'basket:open' при клике на кнопку корзины.
 */

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент шапки.
   */

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.basketButton.addEventListener("click", () => {
      // При клике эмитим событие 'basket:open', которое сигнализирует о необходимости открыть корзину.
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
