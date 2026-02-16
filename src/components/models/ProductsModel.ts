import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Модель для работы с каталогом товаров
 * Отвечает за хранение и управление списком товаров
 * 
 * @emits 'catalog:changed' при изменении каталога товаров
 * @emits 'product:selected' при изменении выбранного товара
 */

export class ProductsModel {
  private items: IProduct[] = [];
  private selectedItem: IProduct | undefined;

   constructor(private events: IEvents, initialItems: IProduct[] = []) {
    this.items = initialItems;
  }

  setItems(items: IProduct[]): void {
    if (!Array.isArray(items)) {
      throw new Error("Не массив");
    }

    this.items = [...items];
    this.selectedItem = undefined;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * Получает товар по идентификатору
   * @param id - уникальный идентификатор товара
   * @returns копию объекта товара или undefined если не найден
   */

  getProductById(id: string): IProduct | undefined {
    if (!id || typeof id !== "string") {
      throw new Error("ID товара неккоректно, либо оно отстутсвует");
    }

    const product = this.items.find((item) => item.id === id);

    return product ? { ...product } : undefined;
  }

  getSelectedItem(): IProduct | undefined {
    return this.selectedItem ? { ...this.selectedItem } : undefined;
  }

  /**
   * Сохраняет товар для детального просмотра в модальном окне
   * @param item - товар для отображения или null для сброса выбора
   */

  setSelectedItem(item: IProduct | null): void {
    if (item === null) {
      this.selectedItem = undefined;
      return;
    }

    if (!item || typeof item !== "object") {
      throw new Error("Не валидный обьект");
    }

    this.selectedItem = { ...item };
    this.events.emit('product:selected');
  }
}
