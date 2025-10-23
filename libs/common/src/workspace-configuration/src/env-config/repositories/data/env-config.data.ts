export const ENV_CONFIG_DATA = {
  customer: {
    'base-path': 'customer',
    'secret-manager': {
      'base-name': 'pixartprinting/comcore/customer',
      'secret-names': ['m2m/cimpress', 'm2m/auth0'],
    },
  },
  order: {
    'base-path': 'order',
    'secret-manager': {
      'base-name': 'pixartprinting/comcore/order',
      'secret-names': ['m2m/cimpress', 'm2m/auth0'],
    },
  },
};
