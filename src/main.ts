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
  Page,
  Success,
} from "./components/views";
import { IOrderData, IProduct, TPayment, ValidationErrors } from "./types";
import { API_URL } from "./utils/constants";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";

interface IFormInputPayload {
  field: string;
  value: string;
  form: string;
}

type TModalScreen = "preview" | "basket" | "order" | "contacts" | "success" | null;

const events = new EventEmitter();
const apiService = new ApiService(new Api(API_URL));

const productsModel = new ProductsModel([], events);
const cartModel = new CartModel([], events);
const buyerModel = new BuyerModel({}, events);

const gallery = new Gallery(events, ensureElement<HTMLElement>(".gallery"));
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const page = new Page(ensureElement<HTMLElement>(".page__wrapper"));

const basket = new Basket(events, cloneTemplate<HTMLElement>("#basket"));
const orderForm = new OrderForm(events, cloneTemplate<HTMLElement>("#order"));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLElement>("#contacts"));
const success = new Success(events, cloneTemplate<HTMLElement>("#success"));
const previewCard = new CardPreview(cloneTemplate<HTMLElement>("#card-preview"), {
  onToggle: () => events.emit("card:toggle"),
});

let modalScreen: TModalScreen = null;

function toOrderErrors(errors: ValidationErrors): string[] {
  return [errors.payment, errors.address].filter(
    (error): error is string => Boolean(error)
  );
}

function toContactsErrors(errors: ValidationErrors): string[] {
  return [errors.email, errors.phone].filter(
    (error): error is string => Boolean(error)
  );
}

function isOrderStepValid(errors: ValidationErrors): boolean {
  return !errors.payment && !errors.address;
}

function isContactsStepValid(errors: ValidationErrors): boolean {
  return !errors.email && !errors.phone;
}

function updateHeaderCounter(): void {
  header.render({ counter: cartModel.getTotalCount() });
}

function renderCatalog(): void {
  const productCards = productsModel.getItems().map((product) => {
    const productCard = new CardCatalog(
      cloneTemplate<HTMLElement>("#card-catalog"),
      {
        onSelect: () => events.emit("card:select", product),
      }
    );

    return productCard.render({
      title: product.title,
      image: product.image,
      category: product.category,
      price: product.price,
    });
  });

  gallery.render({ items: productCards });
}

function renderBasketItems(): void {
  const items = cartModel.getItems();
  const basketCards = items.map((item, index) => {
    const basketCard = new CardBasket(
      cloneTemplate<HTMLElement>("#card-basket"),
      {
        onDelete: () => events.emit("basket:item:remove", item.id),
      }
    );

    return basketCard.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basket.render({
    items: basketCards,
    total: cartModel.getTotalPrice(),
    empty: basketCards.length === 0,
  });
}

function openBasketModal(): void {
  renderBasketItems();
  modal.render({ content: basket.render() });
  modal.open();
  modalScreen = "basket";
}

function openSelectedProductModal(): void {
  const selectedProduct = productsModel.getSelectedItem();

  if (!selectedProduct) {
    return;
  }

  const inCart = cartModel.contains(selectedProduct.id);
  const isUnavailable = selectedProduct.price === null;

  modal.render({
    content: previewCard.render({
      title: selectedProduct.title,
      image: selectedProduct.image,
      category: selectedProduct.category,
      description: selectedProduct.description,
      price: selectedProduct.price,
      buttonText: isUnavailable ? "Недоступно" : inCart ? "Удалить из корзины" : "Купить",
      disabled: isUnavailable,
    }),
  });
  modal.open();
  modalScreen = "preview";
}

function syncOrderForm(): void {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  orderForm.render({
    payment: buyerData.payment ?? "",
    address: buyerData.address ?? "",
    valid: isOrderStepValid(errors),
    errors: toOrderErrors(errors),
  });
}

function syncContactsForm(extraErrors: string[] = []): void {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  contactsForm.render({
    email: buyerData.email ?? "",
    phone: buyerData.phone ?? "",
    valid: isContactsStepValid(errors),
    errors: [...toContactsErrors(errors), ...extraErrors],
  });
}

function openOrderModal(): void {
  syncOrderForm();
  modal.render({ content: orderForm.render() });
  modal.open();
  modalScreen = "order";
}

function openContactsModal(): void {
  syncContactsForm();
  modal.render({ content: contactsForm.render() });
  modal.open();
  modalScreen = "contacts";
}

function openSuccessModal(total: number): void {
  success.render({ total });
  modal.render({ content: success.render() });
  modal.open();
  modalScreen = "success";
}

function handleFormInput(payload: IFormInputPayload): void {
  if (payload.form === "order") {
    if (payload.field === "payment") {
      buyerModel.setData({ payment: payload.value as TPayment });
      return;
    }

    if (payload.field === "address") {
      buyerModel.setData({ address: payload.value });
    }

    return;
  }

  if (payload.form === "contacts") {
    if (payload.field === "email") {
      buyerModel.setData({ email: payload.value });
      return;
    }

    if (payload.field === "phone") {
      buyerModel.setData({ phone: payload.value });
    }
  }
}

events.on("products:changed", renderCatalog);

events.on("product:selected", () => {
  if (productsModel.getSelectedItem()) {
    openSelectedProductModal();
  }
});

events.on("cart:changed", () => {
  updateHeaderCounter();
  renderBasketItems();
});

events.on("buyer:changed", () => {
  if (modalScreen === "order") {
    syncOrderForm();
  }

  if (modalScreen === "contacts") {
    syncContactsForm();
  }
});

events.on<IProduct>("card:select", (product) => {
  productsModel.setSelectedItem(product);
});

events.on("card:toggle", () => {
  const product = productsModel.getSelectedItem();

  if (!product || product.price === null) {
    return;
  }

  modal.close();

  if (cartModel.contains(product.id)) {
    cartModel.removeItem(product.id);
  } else {
    cartModel.addItem(product);
  }

  productsModel.setSelectedItem(null);
});

events.on<string>("basket:item:remove", (id) => {
  cartModel.removeItem(id);
});

events.on("basket:open", openBasketModal);

events.on("basket:order", () => {
  if (cartModel.getTotalCount() === 0) {
    return;
  }

  openOrderModal();
});

events.on<IFormInputPayload>("form:input", handleFormInput);

events.on("order:submit", () => {
  openContactsModal();
});

events.on("contacts:submit", async () => {
  const buyerData = buyerModel.getData();
  const cartItems = cartModel.getItems().map((item) => item.id);

  const orderData: IOrderData = {
    payment: buyerData.payment as TPayment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone,
    items: cartItems,
    total: cartModel.getTotalPrice(),
  };

  try {
    const result = await apiService.submitOrder(orderData);
    openSuccessModal(result.total);
    cartModel.clear();
    buyerModel.clear();
    productsModel.setSelectedItem(null);
  } catch {
    syncContactsForm(["Не удалось оформить заказ"]);
  }
});

events.on("success:close", () => {
  modal.close();
});

events.on("modal:opened", () => {
  page.render({ locked: true });
});

events.on("modal:closed", () => {
  page.render({ locked: false });
});

updateHeaderCounter();
syncOrderForm();
syncContactsForm();

void apiService
  .getProductList()
  .then((items) => {
    productsModel.setItems(items);
  })
  .catch(() => {
    const errorNode = createElement<HTMLElement>("p", {
      className: "gallery__empty",
      textContent: "Не удалось загрузить каталог",
    });

    gallery.render({ items: [errorNode] });
  });
