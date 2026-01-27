import ProductDetailPage from "@/views/user/product-detail/ProductDetailPage";

type ProductDetailRouteProps = {
  params: Promise<{ id: string }>;
};

async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}

export default ProductDetailRoute;
