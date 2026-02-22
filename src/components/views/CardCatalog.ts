import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface ICardCatalogData {
  id: string;
  image: string;
  category: string;
  title: string;
  price: number | null;
}

export class CardCatalog extends Card<ICardCatalogData> {
  private readonly imageNode: HTMLImageElement;
  private readonly categoryNode: HTMLElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.imageNode = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryNode = ensureElement<HTMLElement>(".card__category", this.container);

    this.container.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit("card:select", { id });
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
}
