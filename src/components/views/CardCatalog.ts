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
  onClick?: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<ICardCatalogData> {
  private readonly imageNode: HTMLImageElement;
  private readonly categoryNode: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardCatalogActions) {
    super(container, actions);

    this.imageNode = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryNode = ensureElement<HTMLElement>(".card__category", this.container);
  }

  set image(path: string) {
    this.setImage(this.imageNode, `${CDN_URL}${path}`, this.title);
  }

  set category(value: string) {
    this.setText(this.categoryNode, value);

    Object.entries(categoryMap).forEach(([name, className]) => {
      this.categoryNode.classList.toggle(className, value === name);
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
