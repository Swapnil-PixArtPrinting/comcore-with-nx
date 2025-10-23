export const CIMPRESS_JWT_AUTH = {
  clients: {
    auth0: {
      client_id: 'AUTH0_M2M_CLIENT_ID',
      client_secret: 'AUTH0_M2M_CLIENT_SECRET',
    },
    cimpress: {
      client_id: 'CIMPRESS_M2M_CLIENT_ID',
      client_secret: 'CIMPRESS_M2M_CLIENT_SECRET',
    },
  },
  allowedAuthIssuers: [
    'https://cimpress.auth0.com/',
    'https://oauth.cimpress.io/',
  ],
  jwks: {
    domain: 'https://oauth.cimpress.io/',
    uri: 'https://oauth.cimpress.io/.well-known/jwks.json',
    cache: null,
    expiresAfterSeconds: 86400,
  },
};
