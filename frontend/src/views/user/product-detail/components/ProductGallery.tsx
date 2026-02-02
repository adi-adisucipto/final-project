"use client";

import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  name: string;
  isLoading: boolean;
};

function ProductGallery({ images, name, isLoading }: ProductGalleryProps) {
  let gallery = images;
  if (images.length === 0) {
    gallery = [
      "/paper-bag.png",
      "/paper-bag.png",
      "/paper-bag.png",
      "/paper-bag.png",
    ];
  }
  if (gallery.length > 4) {
    gallery = gallery.slice(0, 4);
  }

  let mainImage = "/paper-bag.png";
  if (gallery.length > 0) {
    mainImage = gallery[0];
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
        Loading image...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center rounded-2xl border border-black/10 bg-white p-6">
        <Image src={mainImage} alt={name} width={240} height={240} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {gallery.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="flex items-center justify-center rounded-xl border border-black/10 bg-white p-2"
          >
            <Image src={src} alt={name} width={60} height={60} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
