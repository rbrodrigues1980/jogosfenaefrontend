export const environment = {
  production: false,
  // Use the Angular dev-server proxy. All HTTP calls to `/api` will be
  // forwarded to the backend running on http://localhost:8080, avoiding CORS
  // issues during local development. Keep the base URL relative so the
  // development server can intercept requests and proxy them correctly.
  apiBaseUrl: '/api'
};
