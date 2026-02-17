import { ensureElement } from "../../utils/utils";
import { Card, ICardActions } from "./Card";

interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

interface ICardBasketActions extends ICardActions {
  onDelete: (event: MouseEvent) => void;
}

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

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
