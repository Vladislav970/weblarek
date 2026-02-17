import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class Card<TState> extends Component<TState> {
  protected titleNode: HTMLElement;
  protected priceNode: HTMLElement;
  protected actionButton?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.titleNode = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceNode = ensureElement<HTMLElement>(".card__price", this.container);
    this.actionButton =
      this.container.querySelector<HTMLButtonElement>("button") ?? undefined;

    if (actions?.onClick) {
      (this.actionButton ?? this.container).addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    this.setText(this.titleNode, value);
  }

  get title(): string {
    return this.titleNode.textContent ?? "";
  }

  set price(value: number | null) {
    const text = value === null ? "Бесценно" : `${value} синапсов`;
    this.setText(this.priceNode, text);
  }
}
