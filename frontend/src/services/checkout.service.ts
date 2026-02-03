import axios from "axios";
import { getSession } from "next-auth/react";
import {
  ApiResponse,
  CreateOrderPayload,
  UploadPaymentProofPayload,
  Order,
} from "@/types/checkout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const res = await axios.post<ApiResponse<Order>>(
      `${API_BASE_URL}/api/orders`,
      payload,
      { headers }
    );

    return res.data.data;
  },

  async uploadPaymentProof(
    orderId: string,
    payload: UploadPaymentProofPayload
  ): Promise<Order> {
    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const res = await axios.post<ApiResponse<Order>>(
      `${API_BASE_URL}/api/orders/${orderId}/payment`,
      payload,
      { headers }
    );

    return res.data.data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const headers = {
      ...(await getAuthHeader()),
    };

    const res = await axios.get<ApiResponse<Order>>(
      `${API_BASE_URL}/api/orders/${orderId}`,
      { headers }
    );

    return res.data.data;
  },

  async getUserOrders(): Promise<Order[]> {
    const headers = {
      ...(await getAuthHeader()),
    };

    const res = await axios.get<ApiResponse<Order[]>>(
      `${API_BASE_URL}/api/orders`,
      { headers }
    );

    return res.data.data;
  },
};