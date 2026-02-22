import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Card<TState> extends Component<TState> {
  protected readonly titleNode: HTMLElement;
  protected readonly priceNode: HTMLElement;
  protected readonly actionButton?: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleNode = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceNode = ensureElement<HTMLElement>(".card__price", this.container);
    this.actionButton =
      this.container.querySelector<HTMLButtonElement>("button") ?? undefined;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.setText(this.titleNode, value);
  }

  set price(value: number | null) {
    const text = value === null ? "Бесценно" : `${value} синапсов`;
    this.setText(this.priceNode, text);
  }
}
