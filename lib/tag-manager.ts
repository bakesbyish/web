export const GTM_ID = 'GTM-5TQPSFC';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const pageview = (url: string) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};
