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
