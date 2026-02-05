import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;

  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
  message?: string;
}

export const uploadService = {
  async uploadPaymentProof(file: File): Promise<string> {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post<UploadResponse>(
        `${API_BASE_URL}/upload/payment-proof`,
        formData,
        {
          headers: {
            ...(await getAuthHeader()),
          },
        }
      );

      return res.data.data.url;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.message ??
            "Failed to upload file"
        );
      }
      throw new Error("Unexpected error occurred");
    }
  },

  async uploadMultiple(files: File[]): Promise<string[]> {
    return Promise.all(
      files.map((file) => this.uploadPaymentProof(file))
    );
  },
};
