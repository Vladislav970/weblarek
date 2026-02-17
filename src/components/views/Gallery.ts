import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  constructor(_events: IEvents, container: HTMLElement) {
    super(container);
  }

  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}
