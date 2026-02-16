import { ensureElement } from "../../utils/utils";
import { Card, ICardActions } from "./Card";

/**
 * @interface ICardBasketData
 * @interface
 * @description Интерфейс данных, используемых для отображения карточки товара в корзине.
 */

interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

interface ICardBasketActions extends ICardActions {
  onDelete: (event: MouseEvent) => void;
}

/**
 * @class CardBasket
 * @extends Card<ICardBasketData>
 * @classdesc Карточка товара, предназначенная для отображения в корзине.
 * Расширяет базовый класс `Card`, добавляя отображение порядкового номера
 * и кнопку удаления товара.
 */

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  /**
   * @constructor
   * @param {HTMLElement} container - Корневой элемент карточки корзины.
   */

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );
    if (actions?.onDelete) {
      this.deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
