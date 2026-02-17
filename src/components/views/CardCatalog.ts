import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";

interface ICardCatalogData {
  image: string;
  category: string;
  title: string;
  price: number | null;
}

interface ICardCatalogActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardCatalogActions) {
    super(container, actions);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.button = this.container as HTMLButtonElement;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      const shouldHaveClass = key === value;
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        shouldHaveClass
      );
    }
  }

  set image(value: string) {
    const fullImagePath = CDN_URL + value;
    this.setImage(this.imageElement, fullImagePath, this.title);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
