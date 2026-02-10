export function mapOrder(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    storeId: order.storeId,
    userAddressId: order.userAddressId,

    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discountAmount),
    shippingCost: Number(order.shippingCost),
    shippingDiscount: Number(order.shippingDiscount),
    totalAmount: Number(order.totalAmount),

    estimatedDelivery: order.estimatedDelivery,
    voucherCodeUsed: order.voucherCodeUsed,

    status: order.status,
    paymentProof: order.paymentProof,
    paymentMethod: "TRANSFER" as const,

    paymentConfirmedAt: order.paymentConfirmedAt?.toISOString() || null,
    shippedAt: order.shippedAt?.toISOString() || null,
    confirmedAt: order.confirmedAt?.toISOString() || null,
    cancelledAt: order.cancelledAt?.toISOString() || null,
    cancellationReason: order.cancellationReason,

    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),

    userAddress: {
      id: order.userAddress.id,
      first_name: order.userAddress.first_name,
      last_name: order.userAddress.last_name,
      address: order.userAddress.address,
      city: {
        city_name: order.userAddress.userCity.city_name,
      },
      provinceId: {
        province_name: order.userAddress.provinceId.province_name,
      },
      postal_code: order.userAddress.postal_code,
    },

    store: order.store && {
      id: order.store.id,
      name: order.store.name, 
    },

    items: order.orderItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      price: Number(item.price),
      quantity: item.quantity,
      discountAmount: Number(item.discountAmount),
      subtotal: Number(item.subtotal),
      product: {
        name: item.product.name,
        images: item.product.images.map((img: any) => ({
          imageUrl: img.imageUrl,
        })),
      },
    })),
  };
}
