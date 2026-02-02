"use client";

type ProductInfoProps = {
  name: string;
  description: string;
  categoryName: string;
  productId: string;
  isLoading: boolean;
};

function ProductInfo({
  name,
  description,
  categoryName,
  productId,
  isLoading,
}: ProductInfoProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
        Loading product info...
      </div>
    );
  }

  let categoryText = categoryName;
  if (!categoryText) categoryText = "Uncategorized";

  let descriptionText = description;
  if (!descriptionText) descriptionText = "No description yet.";

  let productIdText = productId;
  if (!productIdText) productIdText = "-";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-black/50">{categoryText}</p>
        <h1 className="text-2xl font-bold text-black/90">{name}</h1>
      </div>
      <div className="border-t border-black/10 pt-4">
        <h2 className="text-sm font-semibold text-black/80">
          Product Description
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-black/70">
          {descriptionText}
        </p>
      </div>
      <div className="border-t border-black/10 pt-4 text-sm text-black/70">
        <div className="flex items-center justify-between">
          <span>Product ID</span>
          <span className="font-semibold text-black/80">{productIdText}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
