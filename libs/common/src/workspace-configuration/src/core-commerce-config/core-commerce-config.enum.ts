import { ICoreCommerceDetails } from './core-commerce-config.interface';

export const CoreCommerceWorkspaceConfigDetails: ICoreCommerceDetails = {
  pixart: {
    COMMERCETOOL: {
      clientId: 'CTOOLS_CLIENT_ID',
      projectKey: 'CTOOLS_PROJECT_ID',
      clientSecret: 'CTOOLS_CLIENT_SECRET',
      authUrl: 'CTOOLS_PIXART_AUTH_URL',
      apiUrl: 'CTOOLS_PIXART_API_URL',
    },
  },
  easyflyer: {
    COMMERCETOOL: {
      clientId: 'CTOOLS_EASYFLYER_CLIENT_ID',
      projectKey: 'CTOOLS_EASYFLYER_PROJECT_ID',
      clientSecret: 'CTOOLS_EASYFLYER_CLIENT_SECRET',
      authUrl: 'CTOOLS_EASYFLYER_AUTH_URL',
      apiUrl: 'CTOOLS_EASYFLYER_API_URL',
    },
  },
  exaprint: {
    COMMERCETOOL: {
      clientId: 'CTOOLS_EXAPRINT_CLIENT_ID',
      projectKey: 'CTOOLS_EXAPRINT_PROJECT_ID',
      clientSecret: 'CTOOLS_EXAPRINT_CLIENT_SECRET',
      authUrl: 'CTOOLS_EXAPRINT_AUTH_URL',
      apiUrl: 'CTOOLS_EXAPRINT_API_URL',
    },
  },
};
