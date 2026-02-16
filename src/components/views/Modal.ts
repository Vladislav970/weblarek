import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @interface IModal
 * @interface
 * @description Интерфейс данных, управляющих состоянием модального окна.
 */

interface IModal {
  content: HTMLElement; // Содержимое, которое будет отображено внутри модального окна.
}

/**
 * @class Modal
 * @extends Component<IModal>
 * @classdesc Компонент, управляющий отображением и логикой работы модального окна.
 * Обеспечивает возможность установки контента, открытия и закрытия окна.
 *
 * @emits 'modal:close' при закрытии модального окна (кнопкой или кликом по фону).
 * @property content - Устанавливает новый DOM-элемент в качестве содержимого модального окна.
 */

export class Modal extends Component<IModal> {
  protected modalCloseBtn: HTMLButtonElement;
  protected modalContent: HTMLElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент модального окна (вероятно, элемент с классом '.modal').
   */

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.modalCloseBtn = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    this.modalCloseBtn.addEventListener("click", () => this.close());

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  /**
   * Заменяет текущее содержимое модального окна новым DOM-узлом.
   * @param {HTMLElement} content - Новый элемент, который нужно отобразить.
   */
  set content(content: HTMLElement) {
    this.modalContent.replaceChildren(content);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }
}
