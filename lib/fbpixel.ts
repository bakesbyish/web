export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
  window.fbq('track', 'pageview');
};

/**
 * @description - Analayize official events
 * @param {string} name - The name of the event
 * @param options - The options that should be applied
 **/
export const event = (name: string, options = {}) => {
  window.fbq('track', name, options);
};
