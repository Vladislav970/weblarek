import {
  IApi,
  IOrderData,
  IOrderResult,
  IProduct,
  IProductListResponse,
} from "../../types";

export class ApiService {
  constructor(private readonly api: IApi) {}

  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<IProductListResponse>("/product/");
    return response.items;
  }

  async submitOrder(order: IOrderData): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}
