import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  private readonly closeButton: HTMLButtonElement;
  private readonly contentNode: HTMLElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
    this.contentNode = ensureElement<HTMLElement>(".modal__content", this.container);

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentNode.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
    this.events.emit("modal:opened");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:closed");
  }
}
