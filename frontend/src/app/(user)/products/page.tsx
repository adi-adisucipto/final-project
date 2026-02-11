import ProductPage from "@/views/user/products/ProductPage";
import { Suspense } from "react";

function Products() {
  return (
    <Suspense fallback={<div>Loading verification data...</div>}>
      <ProductPage />
    </Suspense>
  );
}

export default Products;
