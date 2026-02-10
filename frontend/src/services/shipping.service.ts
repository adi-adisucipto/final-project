import axios from "axios";

export interface ShippingCostParams {
  storeCityId: number;
  userCityId: number;
  weightInGrams: number;
  courierCode: string;
}

export interface ShippingService {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}

interface BackendShippingResult {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd?: string;
}

export interface ShippingCostResponse {
  courier: string;
  services: ShippingService[];
}

export const shippingService = {
  async calculateCost(params: ShippingCostParams): Promise<ShippingService[]> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/cost`, 
        {
          storeCityId: params.storeCityId,
          userCityId: params.userCityId,
          weightInGrams: params.weightInGrams,
          courierCode: params.courierCode,
        }
      );
      const backendResults: BackendShippingResult[] = response.data.result || [];
      
      const transformedServices: ShippingService[] = backendResults.map(item => ({
        service: item.service,
        description: item.description,
        cost: [{
          value: item.cost,
          etd: item.etd || "2-3",
          note: ""
        }]
      }));
      
      return transformedServices;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }
      throw error;
    }
  },
};