// Card.ts
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Базовый интерфейс для действий карточки
 */
export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

/**
 * @class Card
 * @extends Component<T>
 * @template T Тип данных, представляющий товар.
 * @classdesc Базовый класс для представления карточки товара.
 */
export class Card<T> extends Component<T> {
  protected _title?: HTMLElement;
  protected _price?: HTMLElement;
  protected _button?: HTMLButtonElement;

  /**
   * @constructor
   * @param {HTMLElement} container - Корневой элемент карточки.
   * @param {ICardActions} actions - Действия для карточки.
   */
  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", this.container);
    this._price = ensureElement<HTMLElement>(".card__price", this.container);

    //т.к. она опциональна(я кстати не помню почему я так решил), оставлю querySelector
    this._button = this.container.querySelector("button") || undefined;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        this.container.addEventListener("click", actions.onClick);
      }
    }
  }

  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value ? `${value} синапсов` : "Бесценно";
    }
  }
}
