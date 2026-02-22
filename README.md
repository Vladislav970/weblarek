# WebLarek

Интернет-магазин для покупки цифровых «товаров навыков».
Проект реализован на TypeScript по архитектуре MVP и включает:
- слой моделей данных;
- слой представления (UI-компоненты на классах);
- событийный брокер;
- презентер в `src/main.ts`, который связывает Model и View.

## Запуск

1. Установить зависимости:
```bash
npm install
```
2. Создать `.env` в корне проекта:
```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```
3. Запустить dev-сервер:
```bash
npm run dev
```
4. Сборка production:
```bash
npm run build
```

## Архитектура MVP

- `Model`: хранит данные и эмитит события при изменениях.
- `View`: управляет DOM, не хранит бизнес-данные и генерирует пользовательские события.
- `Presenter`: подписывается на события Model/View и координирует логику приложения.

В проекте используется один презентер (страница одна), реализован в `src/main.ts`.

## Структура проекта

- `src/types/index.ts` - все основные типы и интерфейсы.
- `src/components/base` - базовые инфраструктурные классы (`Api`, `Component`, `EventEmitter`).
- `src/components/models` - модели данных и API-сервис.
- `src/components/views` - UI-компоненты.
- `src/main.ts` - презентер и точка входа.
- `src/utils/constants.ts` - URL API/CDN и маппинг CSS-категорий.
- `src/utils/utils.ts` - утилиты для DOM и шаблонов.

## Типы данных (`src/types/index.ts`)

- `ApiPostMethods = "POST" | "PUT" | "DELETE"`
- `IApi`
  - `get<T>(uri: string): Promise<T>`
  - `post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>`
- `IProduct`
  - `id: string`
  - `description: string`
  - `image: string`
  - `title: string`
  - `category: string`
  - `price: number | null`
- `TPayment = "cash" | "card"`
- `IBuyer`
  - `payment: TPayment`
  - `email: string`
  - `phone: string`
  - `address: string`
- `IOrderData extends IBuyer`
  - `total: number`
  - `items: string[]`
- `IOrderResult`
  - `id: string`
  - `total: number`
- `ValidationErrors = Partial<Record<keyof IBuyer, string>>`
- `IProductListResponse`
  - `total: number`
  - `items: IProduct[]`

## Базовые классы

### `Api` (`src/components/base/Api.ts`)
Назначение: HTTP-клиент для `GET/POST/PUT/DELETE`.

Конструктор:
- `constructor(baseUrl: string, options: RequestInit = {})`

Поля:
- `baseUrl: string`
- `options: RequestInit`

Методы:
- `get<T extends object>(path: string): Promise<T>`
- `post<T extends object>(path: string, payload: object, method?: "POST" | "PUT" | "DELETE"): Promise<T>`
- `parseResponse<T>(response: Response): Promise<T>` (private)

### `Component<TState>` (`src/components/base/Component.ts`)
Назначение: базовый UI-компонент.

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `container: HTMLElement`

Методы:
- `setText(element: HTMLElement | undefined, value: string): void`
- `setImage(element: HTMLImageElement | undefined, src: string, alt?: string): void`
- `render(data?: Partial<TState>): HTMLElement`

### `EventEmitter` (`src/components/base/Events.ts`)
Назначение: брокер событий приложения.

Поля:
- `listeners: Map<EventKey, Set<AnyHandler>>`

Методы:
- `on<T>(event: EventKey, callback: EventHandler<T>): void`
- `off(event: EventKey, callback: AnyHandler): void`
- `emit<T>(event: string, data?: T): void`
- `trigger<T>(event: string, context?: Partial<T>): (data?: T) => void`

## Модели данных

### `ProductsModel` (`src/components/models/ProductsModel.ts`)
Назначение: хранение каталога и выбранного товара.

Конструктор:
- `constructor(initial: IProduct[] = [], events: IEvents = new EventEmitter())`

Поля:
- `events: IEvents`
- `catalog: IProduct[]`
- `selectedId: string | null`

Методы:
- `setItems(items: IProduct[]): void` - сохраняет каталог, сбрасывает выбранный товар, эмитит `products:changed`.
- `getItems(): IProduct[]`
- `getProductById(id: string): IProduct | undefined`
- `setSelectedItem(product: IProduct | null): void` - меняет выбранный товар, эмитит `product:selected`.
- `getSelectedItem(): IProduct | undefined`

### `CartModel` (`src/components/models/CartModel.ts`)
Назначение: хранение состояния корзины.

Конструктор:
- `constructor(initial: IProduct[] = [], events: IEvents = new EventEmitter())`

Поля:
- `events: IEvents`
- `items: IProduct[]`

Методы:
- `getItems(): IProduct[]`
- `contains(productId: string): boolean`
- `addItem(product: IProduct): void` - добавляет товар (если доступен и не дубликат), эмитит `cart:changed`.
- `removeItem(productId: string): void` - удаляет товар, эмитит `cart:changed` при изменении.
- `clear(): void` - очищает корзину, эмитит `cart:changed` при изменении.
- `getTotalCount(): number`
- `getTotalPrice(): number`

### `BuyerModel` (`src/components/models/BuyerModel.ts`)
Назначение: хранение и валидация данных покупателя.

Конструктор:
- `constructor(initial: Partial<IBuyer> = {}, events: IEvents = new EventEmitter())`

Поля:
- `events: IEvents`
- `state: Partial<IBuyer>`

Методы:
- `setData(data: Partial<IBuyer>): void` - частично обновляет данные, эмитит `buyer:changed`.
- `getData(): Partial<IBuyer>`
- `validate(): ValidationErrors`
- `clear(): void` - очищает данные, эмитит `buyer:changed` при изменении.

### `ApiService` (`src/components/models/ApiService.ts`)
Назначение: доменный слой API (композиция с `IApi`).

Конструктор:
- `constructor(api: IApi)`

Поля:
- `api: IApi`

Методы:
- `getProductList(): Promise<IProduct[]>`
- `submitOrder(order: IOrderData): Promise<IOrderResult>`

## Классы слоя View

### `Gallery` (`src/components/views/Gallery.ts`)
Назначение: рендер каталога на главной странице.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `container: HTMLElement`

Методы:
- `set items(value: HTMLElement[])`
- `render(data?: Partial<IGalleryData>): HTMLElement`

### `Header` (`src/components/views/header.ts`)
Назначение: шапка и счетчик корзины.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `counterNode: HTMLElement`
- `basketButton: HTMLButtonElement`

Методы:
- `set counter(value: number)`
- клик по корзине эмитит `basket:open`

### `Page` (`src/components/views/Page.ts`)
Назначение: управление состоянием обертки страницы (блокировка скролла).

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `container: HTMLElement`

Методы:
- `set locked(value: boolean)` - управляет CSS-модификатором `page__wrapper_locked`.

### `Modal` (`src/components/views/Modal.ts`)
Назначение: универсальное модальное окно.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `closeButton: HTMLButtonElement`
- `contentNode: HTMLElement`

Методы:
- `set content(value: HTMLElement)`
- `open(): void` - добавляет `modal_active`, эмитит `modal:opened`.
- `close(): void` - снимает `modal_active`, эмитит `modal:closed`.

### `Card<TState>` (`src/components/views/Card.ts`)
Назначение: базовый класс карточек товара.

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `titleNode: HTMLElement`
- `priceNode: HTMLElement`
- `actionButton?: HTMLButtonElement`

Методы:
- `set id(value: string)`
- `set title(value: string)`
- `set price(value: number | null)`

### `CardCatalog` (`src/components/views/CardCatalog.ts`)
Назначение: карточка товара в каталоге.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `imageNode: HTMLImageElement`
- `categoryNode: HTMLElement`

Методы:
- `set image(path: string)`
- `set category(value: string)`
- клик эмитит `card:select` (`{ id }`)

### `CardPreview` (`src/components/views/CardPreview.ts`)
Назначение: детальная карточка товара (в модалке).

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `imageNode: HTMLImageElement`
- `categoryNode: HTMLElement`
- `descriptionNode: HTMLElement`
- `buyButton: HTMLButtonElement`

Методы:
- `set image(path: string)`
- `set category(value: string)`
- `set description(value: string)`
- `set buttonText(value: string)`
- `set disabled(value: boolean)`
- клик по кнопке эмитит `card:toggle` (`{ id }`)

### `CardBasket` (`src/components/views/CardBasket.ts`)
Назначение: карточка товара внутри корзины.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `indexNode: HTMLElement`
- `deleteButton: HTMLButtonElement`

Методы:
- `set index(value: number)`
- клик по удалению эмитит `basket:item:remove` (`{ id }`)

### `Basket` (`src/components/views/Basket.ts`)
Назначение: содержимое модалки корзины.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `listNode: HTMLUListElement`
- `totalNode: HTMLElement`
- `orderButton: HTMLButtonElement`

Методы:
- `set items(value: HTMLElement[])`
- `set total(value: number)`
- `set empty(value: boolean)`
- клик по кнопке оформления эмитит `basket:order`

### `Form<TState>` (`src/components/views/Form.ts`)
Назначение: базовый класс форм (общий submit/input/ошибки/валидность).

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `submitButton: HTMLButtonElement`
- `errorsNode: HTMLElement`

Методы:
- `set valid(value: boolean)`
- `set errors(errors: string[])`
- submit формы эмитит `${formName}:submit`
- изменение полей эмитит `form:input` (`{ form, field, value }`)

### `OrderForm` (`src/components/views/OrderForm.ts`)
Назначение: первый шаг оформления (оплата и адрес).

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `paymentButtons: HTMLButtonElement[]`
- `addressInput: HTMLInputElement`

Методы:
- `set payment(value: string)` - управляет `button_alt-active`.
- `set address(value: string)`
- клик по кнопке оплаты эмитит `form:input` с `form: "order"`

### `ContactsForm` (`src/components/views/ContactsForm.ts`)
Назначение: второй шаг оформления (email и телефон).

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `emailInput: HTMLInputElement`
- `phoneInput: HTMLInputElement`

Методы:
- `set email(value: string)`
- `set phone(value: string)`

### `Success` (`src/components/views/Success.ts`)
Назначение: экран успешной оплаты.

Конструктор:
- `constructor(events: IEvents, container: HTMLElement)`

Поля:
- `events: IEvents`
- `descriptionNode: HTMLElement`
- `closeButton: HTMLButtonElement`

Методы:
- `set total(value: number)`
- клик по кнопке эмитит `success:close`

## События приложения

### События моделей
- `products:changed` - каталог товаров сохранен/изменен.
- `product:selected` - изменен выбранный товар для предпросмотра.
- `cart:changed` - изменено содержимое корзины.
- `buyer:changed` - изменены данные покупателя.

### События представлений
- `card:select` - выбор карточки каталога.
- `card:toggle` - купить/удалить товар в предпросмотре.
- `basket:item:remove` - удаление позиции из корзины.
- `basket:open` - открыть корзину из шапки.
- `basket:order` - переход к оформлению из корзины.
- `order:submit` - переход ко второму шагу.
- `contacts:submit` - подтверждение оплаты.
- `form:input` - изменение поля формы.
- `modal:opened` / `modal:closed` - изменение состояния модального окна.
- `success:close` - закрытие окна успешного заказа.

## Презентер (`src/main.ts`)

Презентер реализован в точке входа, без отдельного класса.

Что делает презентер:
- инициализирует `EventEmitter`, модели и представления;
- загружает каталог с сервера (`ApiService.getProductList`) и сохраняет его в `ProductsModel`;
- подписывается на все события моделей и представлений;
- рендерит каталог, корзину, формы и экран успеха;
- контролирует сценарий оформления заказа (2 шага);
- отправляет заказ в API (`ApiService.submitOrder`);
- после успешной оплаты очищает корзину и данные покупателя.

## Проверка соответствия функциональности

Реализованы требования:
- каталог товаров на главной;
- модалка товара с кнопкой `Купить` / `Удалить из корзины`;
- для товара без цены кнопка `Недоступно` и disabled;
- корзина с позициями, удалением, суммой и деактивацией оформления при пустой корзине;
- шаг 1 оформления (оплата + адрес) с валидацией;
- шаг 2 оформления (email + телефон) с валидацией;
- отправка заказа, успешное сообщение, очистка корзины и данных покупателя;
- закрытие модалок по крестику и по клику на оверлей;
- блокировка скролла при открытом модальном окне.
