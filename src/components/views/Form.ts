import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorsContainer = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );

    this.container.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
      const formName = this.container.getAttribute("name");
      if (formName) {
        this.events.emit(`${formName}:submit`);
      }
    });

    this.container.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.name) {
        const formName = this.container.getAttribute("name");
        if (formName) {
          this.events.emit("form:input", {
            field: target.name,
            value: target.value,
            form: formName,
          });
        }
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(errors: string[]) {
    this.errorsContainer.textContent = errors.join(", ");
  }
}
