import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketData {
  items: HTMLElement[];
  total: number;
  empty: boolean;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLUListElement;
  protected totalElement: HTMLElement;
  protected button: HTMLButtonElement;

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
      this.events.emit("order:start");
    });
  }

  set items(elements: HTMLElement[]) {
    this.listElement.replaceChildren(...elements);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set empty(value: boolean) {
    this.button.disabled = value;
  }
}
