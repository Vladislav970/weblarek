import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/ApiService";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { API_URL } from "./utils/constants";
import { IProductListResponse, TPayment, IProduct } from "./types";

// Импорты представлений
import {
  Header,
  Gallery,
  Modal,
  Basket,
  CardCatalog,
  CardBasket,
  CardPreview,
  OrderForm,
  ContactsForm,
  Success,
} from "./components/views";

// Утилиты
import { cloneTemplate, ensureElement } from "./utils/utils";

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
const events = new EventEmitter();

// Модели
const api = new Api(API_URL);
const apiService = new ApiService(api, events);
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// DOM элементы
const modalContainer = ensureElement<HTMLElement>("#modal-container");

// Основные компоненты
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(events, ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, modalContainer);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// Вспомогательные компоненты
const basket = new Basket(events, cloneTemplate(basketTemplate));
const orderForm = new OrderForm(events, cloneTemplate(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplate));
const success = new Success(events, cloneTemplate(successTemplate));

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/** Создает карточку товара для каталога */
const createCatalogCard = (product: IProduct) => {
  const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
    onClick: () => events.emit("card:select", { id: product.id }),
  });
  card.title = product.title;
  card.price = product.price;
  card.image = product.image;
  card.category = product.category;
  return card.render();
};

/** Создает карточку товара для корзины */
const createBasketCard = (item: IProduct, index: number) => {
  const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
    onDelete: () => events.emit("product:remove", { id: item.id }),
  });
  card.title = item.title;
  card.price = item.price;
  card.index = index + 1;
  return card.render();
};

/** Отправляет заказ на сервер */
const submitOrder = async () => {
  try {
    const customerData = buyerModel.getData();
    const cartItems = cartModel.getItems();

    const orderData = {
      payment: customerData.payment as TPayment,
      email: customerData.email as string,
      phone: customerData.phone as string,
      address: customerData.address as string,
      total: cartModel.getTotalPrice(),
      items: cartItems.map((item) => item.id),
    };

    console.log("Sending order:", orderData);
    await apiService.submitOrder(orderData);

    // Успешное оформление
    showOrderSuccess(orderData.total);
  } catch (error) {
    console.error("Ошибка оформления заказа:", error);
    contactsForm.errors = ["Ошибка оформления заказа. Попробуйте еще раз."];
  }
};

/** Показывает экран успешного заказа */
const showOrderSuccess = (total: number) => {
  success.total = total;
  modal.content = success.render();

  // Очищаем данные
  cartModel.clear();
  buyerModel.clear();
};

/** Открывает форму заказа */
const openOrderForm = () => {
  modal.content = orderForm.render();
  modal.open();

  const customerData = buyerModel.getData();
  orderForm.payment = customerData.payment || "";
  orderForm.address = customerData.address || "";
};

// ИНИЦИАЛИЗИРУЕМ НАЧАЛЬНОЕ СОСТОЯНИЕ КОРЗИНЫ
basket.empty = cartModel.getTotalCount() === 0;
basket.total = 0;
basket.items = [];

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

// --- КАТАЛОГ И КАРТОЧКИ ---
events.on("catalog:changed", () => {
  const products = productsModel.getItems();
  const cards = products.map(createCatalogCard);
  gallery.items = cards;
});

events.on("card:select", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) productsModel.setSelectedItem(product);
});

events.on("product:selected", () => {
  const product = productsModel.getSelectedItem();
  if (product) {
    const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => events.emit("product:buy", { id: product.id }),
    });
    preview.title = product.title;
    preview.price = product.price;
    preview.image = product.image;
    preview.category = product.category;
    preview.description = product.description;

    const inCart = cartModel.contains(product.id);
    const isUnavailable = product.price === null;

    if (isUnavailable) {
      preview.buttonText = "Недоступно";
      preview.disabled = true;
    } else {
      preview.buttonText = inCart ? "Удалить из корзины" : "В корзину";
      preview.disabled = false;
    }

    modal.content = preview.render();
    modal.open();
  }
});

// --- КОРЗИНА ---
events.on("cart:changed", () => {
  const itemCount = cartModel.getTotalCount();

  header.counter = itemCount;
  basket.total = cartModel.getTotalPrice();
  basket.empty = itemCount === 0;

  const cartItems = cartModel.getItems().map(createBasketCard);
  basket.items = cartItems;
});

events.on("product:buy", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product && product.price !== null) {
    const inCart = cartModel.contains(data.id);

    if (inCart) {
      cartModel.removeItem(data.id);
    } else {
      cartModel.addItem(product);
    }
    modal.close();
  }
});

events.on("product:remove", (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
});

events.on("order:start", openOrderForm);

events.on("form:input", (data: { field: string; value: string }) => {
  buyerModel.setData({ [data.field]: data.value });
});

events.on("order:submit", () => {
  modal.content = contactsForm.render();
});

events.on("contacts:submit", () => {
  submitOrder();
});

events.on("success:close", () => {
  modal.close();
});

events.on("customer:changed", () => {
  const errors = buyerModel.validate();
  const customerData = buyerModel.getData();

  // ПОЛНОЕ ОБНОВЛЕНИЕ OrderForm
  orderForm.payment = customerData.payment || "";
  orderForm.address = customerData.address || "";
  orderForm.valid = !(errors.payment || errors.address);
  orderForm.errors = [errors.payment, errors.address].filter(
    Boolean
  ) as string[];

  // ПОЛНОЕ ОБНОВЛЕНИЕ ContactsForm
  contactsForm.email = customerData.email || "";
  contactsForm.phone = customerData.phone || "";
  contactsForm.valid = Object.keys(errors).length === 0;
  contactsForm.errors = Object.values(errors).filter(Boolean) as string[];
});

// ==================== ЗАГРУЗКА ДАННЫХ ====================
apiService
  .getProductList()
  .then((response: IProductListResponse) => {
    productsModel.setItems(response.items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога:", error);
  });
