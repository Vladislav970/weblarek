# WebLarek

Клиентское приложение интернет-магазина для веб-разработчиков. В этой части проекта реализованы модели данных, типизация и коммуникационный слой для работы с API.

## Запуск

1. Установить зависимости:
```bash
npm install
```
2. Создать файл `.env` в корне проекта:
```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```
3. Запустить проект:
```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Архитектурный паттерн

Приложение построено по паттерну `MVP`:
- `Model`: хранение и изменение данных предметной области.
- `View`: отображение данных и генерация пользовательских событий.
- `Presenter` (в проекте роль выполняет `StoreApp` в `src/main.ts`): связывает модели и представления, обрабатывает сценарии приложения.

## Структура базового кода

- `src/components/base/Api.ts` - базовый HTTP-класс с методами `get` и `post`.
- `src/components/base/Component.ts` - базовый UI-компонент (рендеринг, работа с DOM).
- `src/components/base/Events.ts` - брокер событий `EventEmitter` и интерфейс `IEvents`.
- `src/utils/constants.ts` - константы API/CDN и карта категорий.
- `src/utils/utils.ts` - утилиты для шаблонов и DOM.

### Базовые классы

`Api`:
- назначение: выполнение HTTP-запросов.
- конструктор: `constructor(baseUrl: string, options?: RequestInit)`.
- методы: `get<T>(path: string): Promise<T>`, `post<T>(path: string, payload: object, method?: "POST" | "PUT" | "DELETE"): Promise<T>`.

`EventEmitter`:
- назначение: регистрация и вызов обработчиков событий.
- методы: `on`, `off`, `emit`, `trigger`.

`Component<TState>`:
- назначение: базовый класс для представлений.
- методы: `render`, `setText`, `setImage`, `setDisabled`, `toggleClass`.

## Данные

Все типы и интерфейсы описаны в `src/types/index.ts`.

### Интерфейсы и типы

```ts
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "cash" | "card";

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderData extends IBuyer {
  total: number;
  items: string[];
}
```

Назначение:
- `IProduct`: структура товара каталога.
- `IBuyer`: данные покупателя для оформления заказа.
- `IOrderData`: объект, отправляемый на сервер при оформлении заказа.
- `IOrderResult`: ответ сервера после оформления заказа.
- `IProductListResponse`: ответ сервера с массивом товаров.
- `ValidationErrors`: объект ошибок валидации полей покупателя.

## Модели данных

### `ProductsModel` (`src/components/models/ProductsModel.ts`)

Зона ответственности: хранение каталога товаров и выбранного для предпросмотра товара.

Конструктор:
- `constructor(initial: IProduct[] = [])`

Поля:
- `catalog: IProduct[]` - массив всех товаров.
- `selectedId: string | null` - `id` выбранного товара.

Методы:
- `setItems(items: IProduct[]): void` - сохранить массив товаров.
- `getItems(): IProduct[]` - получить массив товаров.
- `getProductById(id: string): IProduct | undefined` - получить товар по `id`.
- `setSelectedItem(product: IProduct | null): void` - сохранить выбранный товар.
- `getSelectedItem(): IProduct | undefined` - получить выбранный товар.

### `CartModel` (`src/components/models/CartModel.ts`)

Зона ответственности: хранение товаров, добавленных в корзину.

Конструктор:
- `constructor(initial: IProduct[] = [])`

Поля:
- `items: IProduct[]` - массив товаров корзины.

Методы:
- `getItems(): IProduct[]` - получить массив товаров корзины.
- `addItem(product: IProduct): void` - добавить товар в корзину.
- `removeItem(productId: string): void` - удалить товар из корзины по `id`.
- `clear(): void` - очистить корзину.
- `getTotalPrice(): number` - получить суммарную стоимость корзины.
- `getTotalCount(): number` - получить количество товаров в корзине.
- `contains(productId: string): boolean` - проверить наличие товара в корзине по `id`.

### `BuyerModel` (`src/components/models/BuyerModel.ts`)

Зона ответственности: хранение и валидация данных покупателя.

Конструктор:
- `constructor(initial: Partial<IBuyer> = {})`

Поля:
- `state: Partial<IBuyer>` - текущие данные покупателя.

Методы:
- `setData(data: Partial<IBuyer>): void` - частично обновить данные покупателя без потери уже введенных полей.
- `getData(): Partial<IBuyer>` - получить все сохраненные данные покупателя.
- `clear(): void` - очистить данные покупателя.
- `validate(): ValidationErrors` - вернуть объект ошибок валидации по полям `payment`, `address`, `phone`, `email`.

## Слой коммуникации

### `ApiService` (`src/components/models/ApiService.ts`)

Зона ответственности: работа с сервером через композицию с базовым классом `Api` (`IApi`).

Конструктор:
- `constructor(api: IApi)`

Поля:
- `api: IApi` - объект для выполнения HTTP-запросов.

Методы:
- `getProductList(): Promise<IProduct[]>` - выполняет `GET /product/`, возвращает массив товаров.
- `submitOrder(order: IOrderData): Promise<IOrderResult>` - выполняет `POST /order/`, отправляет данные заказа.

## Компоненты представления

Основные UI-компоненты находятся в `src/components/views/` и работают через события `EventEmitter`.

- `Gallery` - рендер карточек каталога.
- `Header` - кнопка корзины и счетчик товаров.
- `Modal` - модальное окно (открытие, закрытие по крестику и по оверлею, блокировка прокрутки фона).
- `CardCatalog` - карточка товара в каталоге.
- `CardPreview` - карточка товара в модальном окне (`Купить`, `Удалить из корзины`, `Недоступно`).
- `Basket` - список товаров корзины, сумма, кнопка оформления, состояние `Корзина пуста`.
- `OrderForm` - первый шаг оформления (`payment`, `address`).
- `ContactsForm` - второй шаг оформления (`email`, `phone`).
- `Success` - экран успешной оплаты.

## Проверка моделей в `main.ts`

В `src/main.ts`:
- создаются экземпляры `ProductsModel`, `CartModel`, `BuyerModel`, `ApiService`;
- выполняется тестирование всех методов моделей через `console.log` с комментариями;
- для тестов используется `apiProducts` из `src/utils/data.ts`;
- выполняется запрос каталога на сервер, результат сохраняется в `ProductsModel` и выводится в консоль.
