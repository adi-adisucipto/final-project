import axios from "axios";
import { getSession } from "next-auth/react";
import {
  ApiResponse,
  CreateOrderPayload,
  DiscountPreviewPayload,
  DiscountPreviewResponse,
  UploadPaymentProofPayload,
  OrderDetail,
} from "@/types/checkout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<OrderDetail> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const res = await axios.post<ApiResponse<OrderDetail>>(
      `${API_BASE_URL}/checkout`,
      payload,
      { headers }
    );

    return res.data.data;
  },

  async previewDiscounts(
    payload: DiscountPreviewPayload
  ): Promise<DiscountPreviewResponse> {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const res = await axios.post<ApiResponse<DiscountPreviewResponse>>(
      `${API_BASE_URL}/checkout/preview`,
      payload,
      { headers }
    );

    return res.data.data;
  },

  async uploadPaymentProof(
    orderId: string,
    payload: UploadPaymentProofPayload
  ): Promise<OrderDetail> {
    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const res = await axios.post<ApiResponse<OrderDetail>>(
      `${API_BASE_URL}/checkout/${orderId}/payment`,
      payload,
      { headers }
    );

    return res.data.data;
  },

  async getOrderById(orderId: string): Promise<OrderDetail> {
    const headers = {
      ...(await getAuthHeader()),
    };

    const res = await axios.get<ApiResponse<OrderDetail>>(
      `${API_BASE_URL}/checkout/${orderId}`,
      { headers }
    );

    return res.data.data;
  },

  async getUserOrders(): Promise<OrderDetail[]> {
    const headers = {
      ...(await getAuthHeader()),
    };

    const res = await axios.get<ApiResponse<OrderDetail[]>>(
      `${API_BASE_URL}/checkout`,
      { headers }
    );

    return res.data.data;
  },
};
