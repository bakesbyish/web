import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanity = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true,
  apiVersion: '2021-10-21',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(sanity).image(source);
