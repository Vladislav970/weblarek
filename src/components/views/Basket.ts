import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketData {
  items: HTMLElement[];
  total: number;
  empty: boolean;
}

export class Basket extends Component<IBasketData> {
  private readonly listNode: HTMLUListElement;
  private readonly totalNode: HTMLElement;
  private readonly orderButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.listNode = ensureElement<HTMLUListElement>(".basket__list", this.container);
    this.totalNode = ensureElement<HTMLElement>(".basket__price", this.container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.orderButton.addEventListener("click", () => this.events.emit("order:start"));
  }

  set items(value: HTMLElement[]) {
    if (value.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "basket__empty";
      emptyState.textContent = "Корзина пуста";
      this.listNode.replaceChildren(emptyState);
      return;
    }

    this.listNode.replaceChildren(...value);
  }

  set total(value: number) {
    this.setText(this.totalNode, `${value} синапсов`);
  }

  set empty(value: boolean) {
    this.orderButton.disabled = value;
  }
}
