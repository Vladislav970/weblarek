import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private items = new Map<string, IProduct>();

  constructor(private readonly events: IEvents) {}

  getItems(): IProduct[] {
    return Array.from(this.items.values()).map((item) => ({ ...item }));
  }

  contains(productId: string): boolean {
    return this.items.has(productId);
  }

  addItem(product: IProduct): void {
    if (!product?.id) {
      throw new Error("CartModel.addItem expects product with id");
    }

    if (product.price === null || this.items.has(product.id)) {
      return;
    }

    this.items.set(product.id, { ...product });
    this.events.emit("cart:changed");
  }

  removeItem(productId: string): void {
    const deleted = this.items.delete(productId);
    if (deleted) {
      this.events.emit("cart:changed");
    }
  }

  clear(): void {
    if (this.items.size === 0) {
      return;
    }

    this.items.clear();
    this.events.emit("cart:changed");
  }

  getTotalCount(): number {
    return this.items.size;
  }

  getTotalPrice(): number {
    return this.getItems().reduce((sum, item) => sum + (item.price ?? 0), 0);
  }
}
