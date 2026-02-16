import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @interface IGallery
 * @interface
 * @description Интерфейс данных, представляющий состояние компонента галереи.
 */

interface IGallery {
  items: HTMLElement[]; // Массив DOM-элементов, представляющих отдельные карточки товаров.
}

/**
 * @class Gallery
 * @extends Component<IGallery>
 * @classdesc Компонент для отображения каталога товаров в виде сетки карточек.
 * Управляет контейнером, в который добавляются DOM-элементы карточек.
 */

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент, в котором находится галерея.
   */

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.catalogElement = container;
  }

  /**
   * Устанавливает или обновляет список карточек товаров в галерее.
   * Очищает текущее содержимое галереи и добавляет новые элементы.
   * @param {HTMLElement[]} elements - Массив DOM-элементов карточек для отображения.
   */

  set items(elements: HTMLElement[]) {
    this.catalogElement.replaceChildren(...elements);
  }
}
