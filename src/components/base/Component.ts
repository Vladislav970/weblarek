export abstract class Component<TState> {
  protected constructor(protected readonly container: HTMLElement) {}

  protected setText(element: HTMLElement | undefined, value: string): void {
    if (element) {
      element.textContent = value;
    }
  }

  protected setImage(
    element: HTMLImageElement | undefined,
    src: string,
    alt?: string
  ): void {
    if (!element) {
      return;
    }

    element.src = src;
    if (typeof alt === "string") {
      element.alt = alt;
    }
  }

  render(data?: Partial<TState>): HTMLElement {
    if (data) {
      Object.assign(this as object, data);
    }

    return this.container;
  }
}
