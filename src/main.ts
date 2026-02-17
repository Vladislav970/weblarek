import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { ApiService } from "./components/models/ApiService";
import { BuyerModel } from "./components/models/BuyerModel";
import { CartModel } from "./components/models/CartModel";
import { ProductsModel } from "./components/models/ProductsModel";
import {
  Basket,
  CardBasket,
  CardCatalog,
  CardPreview,
  ContactsForm,
  Gallery,
  Header,
  Modal,
  OrderForm,
  Success,
} from "./components/views";
import {
  IOrderData,
  IProduct,
  IProductListResponse,
  TPayment,
  ValidationErrors,
} from "./types";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

type ProductIdPayload = { id: string };
type FormInputPayload = { field: string; value: string };

class StoreApp {
  private readonly events = new EventEmitter();
  private readonly api = new Api(API_URL);
  private readonly apiService = new ApiService(this.api, this.events);
  private readonly products = new ProductsModel(this.events);
  private readonly cart = new CartModel(this.events);
  private readonly buyer = new BuyerModel(this.events);

  private readonly header = new Header(
    this.events,
    ensureElement<HTMLElement>(".header")
  );
  private readonly gallery = new Gallery(
    this.events,
    ensureElement<HTMLElement>(".gallery")
  );
  private readonly modal = new Modal(
    this.events,
    ensureElement<HTMLElement>("#modal-container")
  );

  private readonly templates = {
    catalogCard: ensureElement<HTMLTemplateElement>("#card-catalog"),
    previewCard: ensureElement<HTMLTemplateElement>("#card-preview"),
    basketCard: ensureElement<HTMLTemplateElement>("#card-basket"),
    basket: ensureElement<HTMLTemplateElement>("#basket"),
    order: ensureElement<HTMLTemplateElement>("#order"),
    contacts: ensureElement<HTMLTemplateElement>("#contacts"),
    success: ensureElement<HTMLTemplateElement>("#success"),
  };

  private readonly basket = new Basket(
    this.events,
    cloneTemplate(this.templates.basket)
  );
  private readonly orderForm = new OrderForm(
    this.events,
    cloneTemplate(this.templates.order)
  );
  private readonly contactsForm = new ContactsForm(
    this.events,
    cloneTemplate(this.templates.contacts)
  );
  private readonly successScreen = new Success(
    this.events,
    cloneTemplate(this.templates.success)
  );

  init(): void {
    this.bindEvents();
    this.initializeViewState();
    void this.loadCatalog();
  }

  private bindEvents(): void {
    this.events.on("catalog:changed", () => this.renderCatalog());
    this.events.on("card:select", (payload: ProductIdPayload) =>
      this.openProductPreview(payload.id)
    );
    this.events.on("product:buy", (payload: ProductIdPayload) =>
      this.toggleProductInCart(payload.id)
    );
    this.events.on("product:remove", (payload: ProductIdPayload) =>
      this.cart.removeItem(payload.id)
    );
    this.events.on("cart:changed", () => this.syncCartView());
    this.events.on("basket:open", () => this.openBasket());
    this.events.on("order:start", () => this.openOrderStep());
    this.events.on("order:submit", () => this.openContactsStep());
    this.events.on("contacts:submit", () => void this.submitOrder());
    this.events.on("success:close", () => this.modal.close());
    this.events.on("form:input", (payload: FormInputPayload) =>
      this.buyer.setData({ [payload.field]: payload.value })
    );
    this.events.on("customer:changed", () => this.syncForms());
  }

  private initializeViewState(): void {
    this.header.counter = 0;
    this.basket.total = 0;
    this.basket.empty = true;
    this.basket.items = [];
  }

  private async loadCatalog(): Promise<void> {
    try {
      const response: IProductListResponse = await this.apiService.getProductList();
      this.products.setItems(response.items);
    } catch (error) {
      console.error("Catalog loading failed", error);
    }
  }

  private renderCatalog(): void {
    const cards = this.products.getItems().map((product) => {
      const card = new CardCatalog(cloneTemplate(this.templates.catalogCard), {
        onClick: () => this.events.emit("card:select", { id: product.id }),
      });

      card.title = product.title;
      card.price = product.price;
      card.image = product.image;
      card.category = product.category;

      return card.render();
    });

    this.gallery.items = cards;
  }

  private openProductPreview(productId: string): void {
    const product = this.products.getProductById(productId);
    if (!product) {
      return;
    }

    this.products.setSelectedItem(product);
    const preview = this.buildPreviewCard(product);
    this.modal.content = preview.render();
    this.modal.open();
  }

  private buildPreviewCard(product: IProduct): CardPreview {
    const preview = new CardPreview(cloneTemplate(this.templates.previewCard), {
      onClick: () => this.events.emit("product:buy", { id: product.id }),
    });

    preview.id = product.id;
    preview.title = product.title;
    preview.price = product.price;
    preview.image = product.image;
    preview.category = product.category;
    preview.description = product.description;

    const unavailable = product.price === null;
    const inCart = this.cart.contains(product.id);

    preview.disabled = unavailable;
    preview.buttonText = unavailable
      ? "Недоступно"
      : inCart
        ? "Убрать из корзины"
        : "Добавить в корзину";

    return preview;
  }

  private toggleProductInCart(productId: string): void {
    const product = this.products.getProductById(productId);
    if (!product || product.price === null) {
      return;
    }

    if (this.cart.contains(productId)) {
      this.cart.removeItem(productId);
    } else {
      this.cart.addItem(product);
    }

    this.modal.close();
  }

  private syncCartView(): void {
    const count = this.cart.getTotalCount();
    const items = this.cart.getItems();

    this.header.counter = count;
    this.basket.total = this.cart.getTotalPrice();
    this.basket.empty = count === 0;
    this.basket.items = items.map((item, index) =>
      this.buildBasketCard(item, index + 1)
    );
  }

  private buildBasketCard(item: IProduct, index: number): HTMLElement {
    const card = new CardBasket(cloneTemplate(this.templates.basketCard), {
      onDelete: () => this.events.emit("product:remove", { id: item.id }),
    });

    card.title = item.title;
    card.price = item.price;
    card.index = index;

    return card.render();
  }

  private openBasket(): void {
    this.modal.content = this.basket.render();
    this.modal.open();
  }

  private openOrderStep(): void {
    this.modal.content = this.orderForm.render();
    this.modal.open();
    this.syncForms();
  }

  private openContactsStep(): void {
    this.modal.content = this.contactsForm.render();
    this.syncForms();
  }

  private syncForms(): void {
    const data = this.buyer.getData();
    const errors = this.buyer.validate();

    this.orderForm.payment = data.payment ?? "";
    this.orderForm.address = data.address ?? "";
    this.orderForm.valid = !errors.payment && !errors.address;
    this.orderForm.errors = [errors.payment, errors.address].filter(
      Boolean
    ) as string[];

    this.contactsForm.email = data.email ?? "";
    this.contactsForm.phone = data.phone ?? "";
    this.contactsForm.valid = this.isContactsStepValid(errors);
    this.contactsForm.errors = [errors.email, errors.phone].filter(
      Boolean
    ) as string[];
  }

  private isContactsStepValid(errors: ValidationErrors): boolean {
    return !errors.email && !errors.phone;
  }

  private async submitOrder(): Promise<void> {
    const data = this.buyer.getData();
    const payload: IOrderData = {
      payment: data.payment as TPayment,
      email: data.email as string,
      phone: data.phone as string,
      address: data.address as string,
      total: this.cart.getTotalPrice(),
      items: this.cart.getItems().map((item) => item.id),
    };

    try {
      await this.apiService.submitOrder(payload);
      this.showOrderSuccess(payload.total);
    } catch (error) {
      console.error("Order submission failed", error);
      this.contactsForm.errors = ["Не удалось оформить заказ. Попробуйте снова."];
    }
  }

  private showOrderSuccess(total: number): void {
    this.successScreen.total = total;
    this.modal.content = this.successScreen.render();
    this.cart.clear();
    this.buyer.clear();
  }
}

new StoreApp().init();
