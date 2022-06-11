export interface ITrendingProducts {
  title: string;
  slug: string;
  sku: number;
  price: number;
  image: {
    url: string;
  };
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
	id: string
	name: string
	href: string
	price: string
	imageSrc: string
	imageAlt: string
}
