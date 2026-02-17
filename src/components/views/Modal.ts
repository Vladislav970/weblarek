import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement; // Содержимое, которое будет отображено внутри модального окна.
}

export class Modal extends Component<IModal> {
  protected modalCloseBtn: HTMLButtonElement;
  protected modalContent: HTMLElement;

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
