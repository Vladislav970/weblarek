import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  private readonly counterNode: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.counterNode = ensureElement<HTMLElement>(".header__basket-counter", this.container);
    this.basketButton = ensureElement<HTMLButtonElement>(".header__basket", this.container);

    this.basketButton.addEventListener("click", () => this.events.emit("basket:open"));
  }

  set counter(value: number) {
    this.setText(this.counterNode, String(value));
  }
}
