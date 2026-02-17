import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<TState> extends Component<TState> {
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsNode: HTMLElement;

  constructor(protected readonly events: IEvents, container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorsNode = ensureElement<HTMLElement>(".form__errors", this.container);

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      const formName = this.container.getAttribute("name");
      if (formName) {
        this.events.emit(`${formName}:submit`);
      }
    });

    this.container.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      const formName = this.container.getAttribute("name");

      if (!target?.name || !formName) {
        return;
      }

      this.events.emit("form:input", {
        field: target.name,
        value: target.value,
        form: formName,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(errors: string[]) {
    this.setText(this.errorsNode, errors.join(", "));
  }
}
