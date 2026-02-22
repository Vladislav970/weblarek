import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface ICardPreviewData {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number | null;
  buttonText: string;
  disabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
  private readonly imageNode: HTMLImageElement;
  private readonly categoryNode: HTMLElement;
  private readonly descriptionNode: HTMLElement;
  private readonly buyButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.imageNode = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryNode = ensureElement<HTMLElement>(".card__category", this.container);
    this.descriptionNode = ensureElement<HTMLElement>(".card__text", this.container);
    this.buyButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

    this.buyButton.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit("card:toggle", { id });
      }
    });
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
