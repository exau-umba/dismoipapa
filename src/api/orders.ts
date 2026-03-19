import { getJson, postJson } from './client';

export interface CreateOrderItemPayload {
  format: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shipping_address: string;
  items: CreateOrderItemPayload[];
}

export interface OrderItemFromApi {
  id: string;
  format: string;
  quantity: number;
  unit_price?: string;
  book_title?: string;
  format_name?: string;
  [key: string]: unknown;
}

export interface CreatedOrder {
  id: string;
  order_date?: string;
  total_amount?: string | number;
  payment_status?: string | null;
  shipping_status?: string | null;
  shipping_address?: string;
  items?: OrderItemFromApi[];
  created_at?: string; // fallback si l'API renvoie encore cette clé
  total?: string | number; // fallback
  status?: string; // fallback
  [key: string]: unknown;
}

export type MyOrder = CreatedOrder;

export function listMyOrders(): Promise<MyOrder[]> {
  return getJson<MyOrder[]>('/api/orders/');
}

export function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  return postJson<CreatedOrder>('/api/orders/', payload);
}

export function simulateOrderPayment(orderId: string): Promise<unknown> {
  return postJson('/api/payments/simulate/', { order_id: orderId });
}
