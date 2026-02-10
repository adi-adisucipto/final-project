"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import ShippingAddress from "@/components/cart/ShippingAddress";
import OrderItemsList from "@/components/checkout/OrderItemList";
import PromoCodeInput from "@/components/checkout/PromoCodeInput";
import PaymentProofUpload from "@/components/checkout/PaymentProofUpload";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import ShippingMethodSelector from "@/components/checkout/shippingCostSection";
import { 
  PaymentMethod, 
  VoucherData, 
  OrderItem, 
  CreateOrderPayload 
} from "@/types/checkout";
import { orderService } from "@/services/checkout.service";
import { uploadService } from "@/services/uploadbtf.service";
import { shippingService, ShippingService } from "@/services/shipping.service";
import { useCart } from "@/hooks/useCart";
import { useShippingAddress } from "@/hooks/useShippingAddress";

export default function CheckoutPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const { cartItems, groupedItems, isLoading: isLoadingCart } = useCart();
  const { address, isLoading: isLoadingAddress } = useShippingAddress();
  const storeId = groupedItems[0]?.store.id;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [productDiscount, setProductDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherData | null>(null);

  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingService | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const [availableVouchers] = useState<VoucherData[]>([
    {
      code: "FREESHIP",
      type: "FIXED",
      value: 5000,
      minPurchase: 0,
      description: "Free Shipping",
    },
    {
      code: "DISKON10",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 50000,
      description: "10% Off (min. Rp 50.000)",
    },
  ]);

  useEffect(() => {
    if (!isLoadingCart && !isLoadingAddress) {
      if (!cartItems.length) {
        enqueueSnackbar("Keranjang kosong", { variant: "warning" });
        router.push("/cart");
        return;
      }

      if (!address) {
        enqueueSnackbar("Silakan pilih alamat pengiriman", {
          variant: "warning",
        });
        router.push("/profile/address");
      }
    }
  }, [cartItems, address, isLoadingCart, isLoadingAddress, router, enqueueSnackbar]);

  const orderItems: OrderItem[] = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    image: item.product.images[0]?.imageUrl || "/placeholder-product.png",
    price: Number(item.product.price),
    quantity: item.quantity,
    storeName: item.store.name,
  }));

  useEffect(() => {
    if (!storeId || cartItems.length === 0) {
      setProductDiscount(0);
      return;
    }

    let active = true;
    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.product.price),
    }));

    const loadPreview = async () => {
      try {
        const data = await orderService.previewDiscounts({
          storeId,
          items,
        });
        if (active) setProductDiscount(Number(data.discountAmount) || 0);
      } catch (error) {
        if (active) setProductDiscount(0);
      }
    };

    loadPreview();
    return () => {
      active = false;
    };
  }, [storeId, cartItems]);

useEffect(() => {
  const loadShippingCost = async () => {

    if (!address?.city) {
      return;
    }

    if (!groupedItems[0]?.store?.cityId) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }
    setIsLoadingShipping(true);
    
    try {
      const totalWeight = cartItems.reduce((sum, item) => {
        const weight = item.product.weight || 100;
        return sum + (weight * item.quantity);
      }, 0);

      const params = {
        storeCityId: groupedItems[0].store.cityId,
        userCityId: address.city,
        weightInGrams: totalWeight,
        courierCode: "jne",
      };

      const services = await shippingService.calculateCost(params);

      if (services && services.length > 0) {
        setShippingServices(services);
        
        const cheapest = services.reduce((prev, curr) => 
          prev.cost[0].value < curr.cost[0].value ? prev : curr
        );
        setSelectedShipping(cheapest);
      } else {
      }
    } catch (error) {
      console.error("❌ Error loading shipping:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      enqueueSnackbar("Gagal memuat biaya pengiriman", { variant: "error" });
    } finally {
      setIsLoadingShipping(false);
    }
  };

  loadShippingCost();
}, [address, groupedItems, cartItems, enqueueSnackbar]);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const shipping = selectedShipping?.cost[0]?.value || 0;

  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "PERCENTAGE") {
      voucherDiscount = (subtotal * appliedVoucher.value) / 100;
    } else if (appliedVoucher.type === "FIXED") {
      voucherDiscount = appliedVoucher.value;
    }
  }

  const totalDiscount = productDiscount + voucherDiscount;
  const total = subtotal - totalDiscount + shipping;

  const handleApplyVoucher = async (code: string) => {
    const voucher = availableVouchers.find((v) => v.code === code);

    if (!voucher) {
      enqueueSnackbar("Kode voucher tidak valid", { variant: "error" });
      return;
    }

    if (subtotal < voucher.minPurchase) {
      enqueueSnackbar(
        `Minimal pembelian Rp ${voucher.minPurchase.toLocaleString("id-ID")}`,
        { variant: "warning" }
      );
      return;
    }

    setAppliedVoucher(voucher);
    enqueueSnackbar("Voucher berhasil diterapkan!", { variant: "success" });
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    enqueueSnackbar("Voucher dihapus", { variant: "info" });
  };

  const isCheckoutValid = () => {
    if (!paymentMethod) return false;
    if (!address) return false;
    if (orderItems.length === 0) return false;
    if (!selectedShipping) return false;
    if (paymentMethod === "TRANSFER" && !paymentProof) return false;
    return true;
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Pilih metode pembayaran", { variant: "warning" });
      return;
    }

    if (!address) {
      enqueueSnackbar("Pilih alamat pengiriman", { variant: "warning" });
      return;
    }

    if (!selectedShipping) {
      enqueueSnackbar("Pilih metode pengiriman", { variant: "warning" });
      return;
    }

    if (paymentMethod === "TRANSFER" && !paymentProof) {
      enqueueSnackbar("Upload bukti transfer", { variant: "warning" });
      return;
    }

    if (!storeId) {
      enqueueSnackbar("Store ID tidak ditemukan", { variant: "error" });
      return;
    }

    setIsProcessing(true);

    try {
      let paymentProofUrl = "";

      if (paymentMethod === "TRANSFER" && paymentProof) {
        enqueueSnackbar("Mengunggah bukti pembayaran...", { variant: "info" });
        paymentProofUrl = await uploadService.uploadPaymentProof(paymentProof);
      }

      const orderPayload: CreateOrderPayload = {
        userAddressId: address.id,
        storeId: storeId,
        items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: subtotal,
        shippingCost: shipping,
        discountAmount: voucherDiscount,
        totalAmount: total,
        voucherCodeUsed: appliedVoucher?.code,
        paymentMethod: paymentMethod,
      };

      const order = await orderService.createOrder(orderPayload);

      if (paymentMethod === "TRANSFER" && paymentProofUrl) {
        await orderService.uploadPaymentProof(order.id, {
          paymentProofUrl: paymentProofUrl,
        });
      }

      enqueueSnackbar("Pesanan berhasil dibuat!", { variant: "success" });
      router.push(`/orders/${order.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal membuat pesanan";
      enqueueSnackbar(errorMessage, { variant: "error" });
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  if (isLoadingCart || isLoadingAddress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader currentStep={2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddress
              firstName={address?.firstName}
              lastName={address?.lastName}
              address={address?.address}
              onChangeAddress={() => router.push("/profile/address")}
            />

            <ShippingMethodSelector
              services={shippingServices}
              selectedService={selectedShipping}
              onSelect={setSelectedShipping}
              isLoading={isLoadingShipping}
            />

            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />

            {paymentMethod === "TRANSFER" && (
              <PaymentProofUpload
                file={paymentProof}
                onFileSelect={setPaymentProof}
                total={total}
              />
            )}

            <OrderItemsList items={orderItems} />

            <PromoCodeInput
              appliedVoucher={appliedVoucher}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
              availableVouchers={availableVouchers}
            />
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              discount={totalDiscount}
              shipping={shipping}
              total={total}
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
              isValid={isCheckoutValid()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}