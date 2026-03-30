import { getJson, postJson } from './client';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

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
  try {
    return getJson<MyOrder[]>('/api/orders/');
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
}

export function getMyOrder(id: string): Promise<MyOrder> {
  try {
    return getJson<MyOrder>(`/api/orders/${id}/`);
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  try {
    const response = await postJson<CreatedOrder>('/api/orders/', payload);
    // console.log("Order created:", response);
    return response;
  } catch (error) {
    // console.log("Error creating order:", error);
    throw new Error(getFriendlyErrorMessage(error));
  }
}

/** Demande de paiement mobile (notification + code sur le téléphone). */
export function requestWonyapayPayment(payload: { order_id: string; phone: string }): Promise<unknown> {
  try {
    return postJson('/api/payments/wonyapay/request/', payload);
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
}
