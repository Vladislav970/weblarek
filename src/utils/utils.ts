export function pascalToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function isSelector(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined;
}

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export function ensureAllElements<T extends HTMLElement>(
  selectorOrElements: SelectorCollection<T>,
  context: ParentNode = document
): T[] {
  if (isSelector(selectorOrElements)) {
    return Array.from(context.querySelectorAll(selectorOrElements)) as T[];
  }

  if (selectorOrElements instanceof NodeList) {
    return Array.from(selectorOrElements) as T[];
  }

  if (Array.isArray(selectorOrElements)) {
    return selectorOrElements;
  }

  throw new Error("Unknown selector element");
}

export type SelectorElement<T> = T | string;

export function ensureElement<T extends HTMLElement>(
  selectorOrElement: SelectorElement<T>,
  context?: ParentNode
): T {
  if (isSelector(selectorOrElement)) {
    const list = ensureAllElements<T>(selectorOrElement, context ?? document);

    if (list.length === 0) {
      throw new Error(`Selector '${selectorOrElement}' returned no elements`);
    }

    return list[0] as T;
  }

  if (selectorOrElement instanceof HTMLElement) {
    return selectorOrElement;
  }

  throw new Error("Unknown selector element");
}

export function cloneTemplate<T extends HTMLElement>(
  query: string | HTMLTemplateElement
): T {
  const template = ensureElement<HTMLTemplateElement>(query);
  const firstNode = template.content.firstElementChild;

  if (!firstNode) {
    throw new Error("Template has no content");
  }

  return firstNode.cloneNode(true) as T;
}

export function bem(
  block: string,
  element?: string,
  modifier?: string
): { name: string; class: string } {
  const name = [block, element ? `__${element}` : "", modifier ? `_${modifier}` : ""]
    .join("")
    .trim();

  return {
    name,
    class: `.${name}`,
  };
}

export function getObjectProperties(
  obj: object,
  filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
  return Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj)))
    .filter(([name, descriptor]) =>
      filter ? filter(name, descriptor) : name !== "constructor"
    )
    .map(([name]) => name);
}

export function setElementData<T extends Record<string, unknown>>(
  element: HTMLElement,
  data: T
): void {
  Object.entries(data).forEach(([key, value]) => {
    element.dataset[key] = String(value);
  });
}

export function getElementData<T extends Record<string, unknown>>(
  element: HTMLElement,
  scheme: Record<string, (value: string) => unknown>
): T {
  const data: Partial<T> = {};

  Object.keys(element.dataset).forEach((key) => {
    const raw = element.dataset[key];
    const parse = scheme[key];

    if (raw !== undefined && parse) {
      data[key as keyof T] = parse(raw) as T[keyof T];
    }
  });

  return data as T;
}

export function isPlainObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function createElement<T extends HTMLElement>(
  tagName: keyof HTMLElementTagNameMap,
  props?: Partial<Record<keyof T, string | boolean | object>>,
  children?: HTMLElement | HTMLElement[]
): T {
  const element = document.createElement(tagName) as T;

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "dataset" && isPlainObject(value)) {
        setElementData(element, value as Record<string, unknown>);
      } else {
        (element as unknown as Record<string, unknown>)[key] = isBoolean(value)
          ? value
          : String(value);
      }
    });
  }

  if (children) {
    const childNodes = Array.isArray(children) ? children : [children];
    element.append(...childNodes);
  }

  return element;
}
