import { useEffect, useState } from "react";
import { getAddress } from "@/services/address.services";

interface UserAddress {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  isMainAddress: boolean;
}

export function useShippingAddress(userId?: string) {
  const [address, setAddress] = useState<UserAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchAddress = async () => {
      setIsLoading(true);
      try {
        const response = await getAddress(userId);
        const main =
          response?.data?.find((a: UserAddress) => a.isMainAddress) ||
          response?.data?.[0];
        if (main) setAddress(main);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [userId]);

  return { address, isLoading };
}
