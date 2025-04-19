/**
 * Helper utility to get the base path for the application
 * This is useful for GitHub Pages deployment where the app is served from a subdirectory
 */

// The base path should match your GitHub repository name
export const getBasePath = (): string => {
  // Check if we're in a production environment (GitHub Pages)
  const isProduction = import.meta.env.MODE === 'production';
  
  // If in production and running on GitHub Pages, use the repository name as base path
  if (isProduction && window.location.hostname.includes('github.io')) {
    return '/ProtfolioV2';
  }
  
  // Otherwise (local development or other deployment), use root path
  return '';
};

/**
 * Prefixes a path with the base path for the application
 * @param path The path to prefix
 * @returns The prefixed path
 */
export const withBasePath = (path: string): string => {
  const basePath = getBasePath();
  
  // If path already starts with a slash, don't add another one
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
};