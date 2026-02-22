import { Component } from "../base/Component";

interface IPageData {
  locked: boolean;
}

export class Page extends Component<IPageData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set locked(value: boolean) {
    this.container.classList.toggle("page__wrapper_locked", value);
  }
}
