import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  private readonly descriptionNode: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.descriptionNode = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.setText(this.descriptionNode, `Списано ${value} синапсов`);
  }
}
