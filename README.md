# Comcore customer and order service with Nx

## Requirement

### Endpoints should look like:
  https://commerce-core.pixartprinting.net/customer/api/v2/
  https://commerce-core.pixartprinting.net/order/api/v3/
  https://commerce-core.pixartprinting.net/cart/api/v2/

### Architecture:
  Monorepo structure using Nx for managing multiple applications and libraries.
  - commerce-core
    - customer service (Node.js with gRPC)
    - order service (Node.js with gRPC)
    - shared application libraries without versions for common functionalities
    - Docker for containerization

### Project Structure Docker
  web
      - /customer/api/v2 -> port:3001
      - /order/api/v3 -> port:3002
      - /cart/api/v2 -> port:3002
      - /trigger-events/v2 -> port:3002
  customer
    port:3001
  order
    port:3002
  jobs (For queue processing)
  redis (For caching and message brokering)
  mysql (For relational data storage)

### Code Structure Nx
  apps
      customer (app:port:3001, grpc:port:xxxx)
          channel
          customer-group
          address
          app.module.ts
          main.ts
          package.json
      order (app:port:3002, grpc:port:xxxx)
          cart
          order-group
          app.module.ts
          main.ts
          package.json
  libs
      common
          - workspace
          - configutions
          - logger
      corecommerce
          - commercetools
          - cimcommerceV2
      awskit
          - S3
          - parameter store
          - dynamodb
      clients
          - backbone
          - rubiks
  package.json
  .env


### Changelog
  Fix the import paths in customer service to use the correct library names as per the Nx workspace structure.
  Below is the mapping of folder againsts library names used in imports.
    @comcore/ocs-lib-common -> libs/common
    @comcore/ocs-aws-kit -> libs/aws
    @comcore/ocs-lib-corecommerce -> libs/corecommerce
  Please note this is a just a shared code between customer and order service and not published as npm package.
