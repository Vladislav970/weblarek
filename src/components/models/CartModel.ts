import { IProduct } from "../../types";

export class CartModel {
  private items: IProduct[] = [];

  constructor(initial: IProduct[] = []) {
    this.items = initial.map((item) => ({ ...item }));
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
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];
  }

  getTotalCount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    return this.getItems().reduce((sum, item) => sum + (item.price ?? 0), 0);
  }
}
