import { IPaths } from '@interfaces/seo';

/**
 * @description - Get breadcrumbs of the path in google results
 * @param {IPaths[]} paths - The paths array containing the paths and the URL of each path
 * @param {string} URL - The current production URL of the web app
 * @returns {__html: string} - The __html that needs to be in the script tag for google to notice
 **/
export const getBreadCrumbs = (
  paths: IPaths[],
  URL: string
): { __html: string } => {
  const listItems: string[] = [];
  paths.map((path, index) => {
    listItems.push(
      JSON.stringify({
        '@type': 'ListItem',
        position: (index + 1).toString(),
        name: path.name,
        item: `${URL}${path.url}`,
      })
    );
  });

  return {
    __html: `
		{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [${listItems.toString()}]
    }
		`,
  };
};
