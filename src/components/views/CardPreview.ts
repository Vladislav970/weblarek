import { ensureElement } from "../../utils/utils";
import { Card, ICardActions } from "./Card";
import { CDN_URL, categoryMap } from "../../utils/constants";

/**
 * @interface ICardPreviewData
 * @interface
 * @description Интерфейс данных, используемых для отображения предпросмотра товара.
 * Включает все детали, необходимые для полного представления товара.
 */
interface ICardPreviewData {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number | null; // Цена товара (может отсутствовать).
}

/**
 * @class CardPreview
 * @extends Card<ICardPreviewData>
 * @classdesc Карточка товара, предназначенная для отображения полного предпросмотра.
 * Включает изображение, категорию, название, описание, цену и кнопку покупки.
 * Использует ту же логику стилизации категорий, что и CardCatalog.
 */

export class CardPreview extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected button: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий.
   * @param {HTMLElement} container - Корневой элемент карточки предпросмотра.
   */

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
  }

  set image(value: string) {
    const fullImagePath = CDN_URL + value;
    this.setImage(this.imageElement, fullImagePath, this.title);
  }

  /**
   * Устанавливает категорию товара и соответствующий CSS-класс для стилизации.
   * Использует ту же логику, что и в CardCatalog.
   * @param {string} value - Название категории товара.
   */

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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  set disabled(value: boolean) {
    this.button.disabled = value;
  }
}
