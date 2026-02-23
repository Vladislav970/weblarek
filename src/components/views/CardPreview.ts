import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

interface ICardPreviewData {
  image: string;
  category: string;
  title: string;
  description: string;
  price: number | null;
  buttonText: string;
  disabled: boolean;
}

interface ICardPreviewActions {
  onToggle: () => void;
}

export class CardPreview extends Card<ICardPreviewData> {
  private readonly imageNode: HTMLImageElement;
  private readonly categoryNode: HTMLElement;
  private readonly descriptionNode: HTMLElement;
  private readonly buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardPreviewActions) {
    super(container);

    this.imageNode = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryNode = ensureElement<HTMLElement>(".card__category", this.container);
    this.descriptionNode = ensureElement<HTMLElement>(".card__text", this.container);
    this.buyButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

    this.buyButton.addEventListener("click", actions.onToggle);
  }

  set image(path: string) {
    this.setImage(this.imageNode, `${CDN_URL}${path}`, this.titleNode.textContent ?? "");
  }

  set category(value: string) {
    this.setText(this.categoryNode, value);

    Object.entries(categoryMap).forEach(([name, className]) => {
      this.categoryNode.classList.toggle(className, value === name);
    });
  }

  set description(value: string) {
    this.setText(this.descriptionNode, value);
  }

  set buttonText(value: string) {
    this.setText(this.buyButton, value);
  }

  set disabled(value: boolean) {
    this.buyButton.disabled = value;
  }
}
