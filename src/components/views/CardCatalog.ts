import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

interface ICardCatalogData {
  image: string;
  category: string;
  title: string;
  price: number | null;
}

interface ICardCatalogActions {
  onSelect: () => void;
}

export class CardCatalog extends Card<ICardCatalogData> {
  private readonly imageNode: HTMLImageElement;
  private readonly categoryNode: HTMLElement;

  constructor(container: HTMLElement, actions: ICardCatalogActions) {
    super(container);

    this.imageNode = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryNode = ensureElement<HTMLElement>(".card__category", this.container);

    this.container.addEventListener("click", actions.onSelect);
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
