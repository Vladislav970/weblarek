import {
  IApi,
  IOrderData,
  IOrderResult,
  IProductListResponse,
} from "../../types";
import { IEvents } from "../base/Events";

export class ApiService {
  constructor(private readonly api: IApi, private readonly events: IEvents) {}

  async getProductList(): Promise<IProductListResponse> {
    try {
      const response = await this.api.get<IProductListResponse>("/product");
      this.events.emit("api:products:loaded", { total: response.total });
      return response;
    } catch (error) {
      this.events.emit("api:error", { stage: "product-list", error });
      throw error;
    }
  }

  async submitOrder(order: IOrderData): Promise<IOrderResult> {
    try {
      const response = await this.api.post<IOrderResult>("/order", order);
      this.events.emit("api:order:submitted", { id: response.id });
      return response;
    } catch (error) {
      this.events.emit("api:error", { stage: "order-submit", error });
      throw error;
    }
  }
}
