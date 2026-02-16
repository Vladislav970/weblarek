import { IApi, IOrderData, IOrderResult, IProductListResponse } from "../../types";
import { IEvents } from "../base/Events";


export class ApiService {
  constructor(
    private api: IApi,
    private events: IEvents
  ) {}

  async getProductList(): Promise<IProductListResponse> {
    try {
      const response = await this.api.get<IProductListResponse>('/product');
      this.events.emit('api:products:loaded');
      return response;
    } catch (error) {
      this.events.emit('api:error', { error });
      throw error;
    }
  }

  async submitOrder(order: IOrderData): Promise<IOrderResult> {
    try {
      const result = await this.api.post<IOrderResult>('/order', order);
      this.events.emit('api:order:submitted');
      return result;
    } catch (error) {
      this.events.emit('api:error', { error });
      throw error;
    }
  }
}