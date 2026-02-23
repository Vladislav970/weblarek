import { IProduct } from "../../types";
import { EventEmitter, IEvents } from "../base/Events";

export class ProductsModel {
  private catalog: IProduct[] = [];
  private selectedItem: IProduct | null = null;
  private readonly events: IEvents;

  constructor(initial: IProduct[] = [], events: IEvents = new EventEmitter()) {
    this.catalog = [...initial];
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    if (!Array.isArray(items)) {
      return;
    }

    this.catalog = items.map((item) => ({ ...item }));
    this.selectedItem = null;
    this.events.emit("products:changed");
  }

  getItems(): IProduct[] {
    return this.catalog.map((item) => ({ ...item }));
  }

  getProductById(id: string): IProduct | undefined {
    if (!id) {
      return undefined;
    }

    const found = this.catalog.find((item) => item.id === id);
    return found ? { ...found } : undefined;
  }

  setSelectedItem(product: IProduct | null): void {
    this.selectedItem = product ? { ...product } : null;
    this.events.emit("product:selected");
  }

  getSelectedItem(): IProduct | undefined {
    if (!this.selectedItem) {
      return undefined;
    }

    return { ...this.selectedItem };
  }
}
