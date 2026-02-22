import { IProduct } from "../../types";
import { EventEmitter, IEvents } from "../base/Events";

export class CartModel {
  private items: IProduct[] = [];
  private readonly events: IEvents;

  constructor(initial: IProduct[] = [], events: IEvents = new EventEmitter()) {
    this.items = initial.map((item) => ({ ...item }));
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items.map((item) => ({ ...item }));
  }

  contains(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }

  addItem(product: IProduct): void {
    if (!product?.id) {
      throw new Error("CartModel.addItem expects product with id");
    }

    if (product.price === null || this.contains(product.id)) {
      return;
    }

    this.items.push({ ...product });
    this.events.emit("cart:changed");
  }

  removeItem(productId: string): void {
    const nextItems = this.items.filter((item) => item.id !== productId);

    if (nextItems.length === this.items.length) {
      return;
    }

    this.items = nextItems;
    this.events.emit("cart:changed");
  }

  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];
    this.events.emit("cart:changed");
  }

  getTotalCount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }
}
