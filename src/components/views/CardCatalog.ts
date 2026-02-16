import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";

/**
 * @interface ICardCatalogData
 * @interface
 * @description Интерфейс данных, используемых для отображения карточки товара в каталоге.
 */

interface ICardCatalogData {
  image: string;
  category: string;
  title: string;
  price: number | null; // Цена товара (может отсутствовать).
}

interface ICardCatalogActions {
  onClick: (event: MouseEvent) => void;
}

/**
 * @class CardCatalog
 * @extends Card<ICardCatalogData>
 * @classdesc Карточка товара, предназначенная для отображения в каталоге.
 * Отображает изображение, категорию, название и цену товара.
 * Имеет кликабельную область для выбора товара.
 */

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected button: HTMLButtonElement;

  /**
   * @constructor
   * @param {HTMLElement} container - Корневой элемент карточки каталога.
   */

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

    //обработчик вынес в общий класс
  }

  /**
   * Устанавливает категорию товара и соответствующий CSS-класс для стилизации.
   * @param {string} value - Название категории товара.
   */
  set category(value: string) {
    this.categoryElement.textContent = value;

    // Переключаем CSS-классы на элементе категории.
    // Удаляем все классы из categoryMap и добавляем только тот, который соответствует текущей категории.
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

  /**
   * Устанавливает ID товара, сохраняя его в data-атрибуте контейнера.
   * @param {string} value - ID товара.
   */

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
