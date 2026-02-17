import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
  items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.catalogElement = container;
  }

  set items(elements: HTMLElement[]) {
    this.catalogElement.replaceChildren(...elements);
  }
}
