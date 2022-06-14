export interface IProduct {
  title: string;
  slug: string;
  sku: number;
  price?: number;
  image: {
    url: string;
  };
  catergories?: {
    catergory?: string;
    catergorySlug?: string;
    catergoryDescription?: string;
    image?: {
      url: string;
    };
  };
  productVariants?: { id?: string }[];
  hasVariants?: boolean;
}

export interface ICollectionCard {
  catergory: string;
  catergorySlug: string;
  image: {
    url: string;
  };
  catergoryDescription: string;
}

export interface IShopProducts {
  id: string;
  name: string;
  href: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}
