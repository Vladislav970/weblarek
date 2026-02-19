import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/ApiService";
import { BuyerModel } from "./components/models/BuyerModel";
import { CartModel } from "./components/models/CartModel";
import { ProductsModel } from "./components/models/ProductsModel";
import { IProduct } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();
const apiService = new ApiService(new Api(API_URL));

function testProductsModel(items: IProduct[]): void {
  console.log("[ProductsModel] setItems/getItems:", items);
  productsModel.setItems(items);
  console.log("[ProductsModel] Каталог из модели:", productsModel.getItems());

  const firstProduct = items[0];
  if (!firstProduct) {
    return;
  }

  console.log(
    "[ProductsModel] getProductById:",
    productsModel.getProductById(firstProduct.id)
  );

  productsModel.setSelectedItem(firstProduct);
  console.log(
    "[ProductsModel] getSelectedItem после выбора:",
    productsModel.getSelectedItem()
  );

  productsModel.setSelectedItem(null);
  console.log(
    "[ProductsModel] getSelectedItem после сброса:",
    productsModel.getSelectedItem()
  );
}

function testCartModel(items: IProduct[]): void {
  console.log("[CartModel] Пустая корзина:", cartModel.getItems());

  const firstProduct = items[0];
  const secondProduct = items[1];
  const unavailableProduct = items.find((item) => item.price === null);

  if (firstProduct) {
    cartModel.addItem(firstProduct);
  }

  if (secondProduct) {
    cartModel.addItem(secondProduct);
  }

  if (unavailableProduct) {
    cartModel.addItem(unavailableProduct);
  }

  console.log("[CartModel] Товары после addItem:", cartModel.getItems());
  console.log("[CartModel] getTotalCount:", cartModel.getTotalCount());
  console.log("[CartModel] getTotalPrice:", cartModel.getTotalPrice());

  if (firstProduct) {
    console.log(
      "[CartModel] contains(firstProduct.id):",
      cartModel.contains(firstProduct.id)
    );

    cartModel.removeItem(firstProduct.id);
    console.log("[CartModel] После removeItem:", cartModel.getItems());
  }

  cartModel.clear();
  console.log("[CartModel] После clear:", cartModel.getItems());
}

function testBuyerModel(): void {
  console.log("[BuyerModel] Начальные данные:", buyerModel.getData());
  console.log("[BuyerModel] validate() для пустых полей:", buyerModel.validate());

  buyerModel.setData({ address: "Москва, ул. Пушкина, д. 1" });
  console.log("[BuyerModel] После setData(address):", buyerModel.getData());
  console.log(
    "[BuyerModel] validate() после частичного заполнения:",
    buyerModel.validate()
  );

  buyerModel.setData({
    payment: "card",
    email: "user@example.com",
    phone: "+79990000000",
  });
  console.log("[BuyerModel] После полного setData:", buyerModel.getData());
  console.log("[BuyerModel] validate() после полного заполнения:", buyerModel.validate());

  buyerModel.clear();
  console.log("[BuyerModel] После clear:", buyerModel.getData());
}

async function testApiGetMethod(): Promise<void> {
  try {
    const productsFromApi = await apiService.getProductList();
    productsModel.setItems(productsFromApi);
    console.log(
      "[ApiService] GET /product/ -> сохраненный каталог ProductsModel:",
      productsModel.getItems()
    );
  } catch (error) {
    console.error("[ApiService] Ошибка GET /product/", error);
  }
}

function run(): void {
  const testItems: IProduct[] = apiProducts.items;

  console.log("=== Тестирование моделей данных ===");
  testProductsModel(testItems);
  testCartModel(testItems);
  testBuyerModel();

  console.log("=== Тестирование GET метода API ===");
  void testApiGetMethod();
}

run();
