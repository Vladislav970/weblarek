import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface ICardBasketData {
  id: string;
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends Card<ICardBasketData> {
  private readonly indexNode: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.indexNode = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.deleteButton.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit("basket:item:remove", { id });
      }
    });
  }

  set index(value: number) {
    this.setText(this.indexNode, String(value));
  }
}
