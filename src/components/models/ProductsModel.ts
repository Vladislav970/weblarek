import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsModel {
  private catalog: IProduct[] = [];
  private selectedId: string | null = null;

  constructor(private readonly events: IEvents, initial: IProduct[] = []) {
    this.catalog = [...initial];
  }

  setItems(items: IProduct[]): void {
    if (!Array.isArray(items)) {
      throw new Error("ProductsModel.setItems expects an array");
    }

    this.catalog = items.map((item) => ({ ...item }));
    this.selectedId = null;
    this.events.emit("catalog:changed");
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
    this.selectedId = product?.id ?? null;
    this.events.emit("product:selected", { id: this.selectedId });
  }

  getSelectedItem(): IProduct | undefined {
    if (!this.selectedId) {
      return undefined;
    }

    return this.getProductById(this.selectedId);
  }
}
