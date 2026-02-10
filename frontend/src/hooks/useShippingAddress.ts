import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAddress } from "@/services/address.services";

interface UserAddress {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  isMainAddress: boolean;
}

export function useShippingAddress() {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState<UserAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (status !== "authenticated") return;

  const token = session?.accessToken;
  if (!token) return;

  const fetchAddress = async () => {
    setIsLoading(true);
    try {
      const response = await getAddress(token);
      const main =
        response?.data?.find((a: UserAddress) => a.isMainAddress) ||
        response?.data?.[0];
      if (main) setAddress(main);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAddress();
}, [status, session?.accessToken]);

  return { address, isLoading };
}
