import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

interface ICardBasketActions {
  onDelete?: (event: MouseEvent) => void;
}

export class CardBasket extends Card<ICardBasketData> {
  private readonly indexNode: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);

    this.indexNode = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    if (actions?.onDelete) {
      this.deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    this.setText(this.indexNode, String(value));
  }
}
