export interface ICollectionProduct {
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
  sku: number;
  title: string;
  slug: string;
  price: number;
  url: string;
  hasVariants: boolean;
}

export interface IShopDataStream {
  data: {
    productsConnection: {
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      edges: {
        node: {
          sku: number;
          title: string;
          slug: string;
          price: number;
          image: {
            url: string;
          };
          productVariants: {
            id?: string;
          }[];
        };
      }[];
    };
  };
}

export interface IProduct {
  sku: string;
  slug: string;
  title: string;
  price: number;
  url: string;
  brand: { title: string; slug: string; url: string } | null;
  description: string;
  unit: null | string;
  hasCollections: boolean;
  collections: string[];
  hasDiscounts: boolean;
  discountedFrom: number | null;
  discountedPrice: number | null;
  productVariants: {
    name: string;
    price: number;
    url: string | null;
    hasDiscounts: boolean;
    discountedFrom: number | null;
    discountedPrice: number | null;
    variantColors:
      | {
          color: string;
        }[]
      | [];
  }[];
  productColors: {
    color: string;
  }[];
  hasVariants: boolean;
  hasColors: boolean;
}

export interface ICart {
  id: string;
  sku: number;
  url: string;
  slug: string;
  name: string;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  price: number;
  quantity: number;
  itemTotal: number;
}
