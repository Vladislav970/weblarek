import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  contains(itemId: string): boolean {
    return this.items.some((item) => item.id === itemId);
  }

  addItem(item: IProduct): void {
    if (!item || typeof item !== "object") {
      throw new Error("Не валидный продукт");
    }
    if (!item.id || typeof item.id !== "string") {
      throw new Error("Не валидный ID");
    }

    if (item.price === null) {
      throw new Error("Товар бесценный)");
    }

    if (this.contains(item.id)) {
      console.warn("Товар уже находится в корзине");
      return;
    }
    this.items.push({ ...item });
    this.events.emit('cart:changed');
  }

  removeItem(itemId: string): void {
    if (!itemId || typeof itemId !== "string") {
      throw new Error("Не валидный ID");
    }

    if (!this.contains(itemId)) {
      console.warn("Товар не найден в корзине");
      return;
    }

    this.items = this.items.filter((item) => item.id !== itemId);
    this.events.emit('cart:changed');
  }

  getTotalCount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed');
  }
}
