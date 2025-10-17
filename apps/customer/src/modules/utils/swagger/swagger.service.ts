import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { CustomerModule } from '../../customer/customer.module';

@Injectable()
export class SwaggerService {
  async setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Customer Service')
      .setDescription('Generated API Docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: [CustomerModule],
    });

    // CORRECT: Override Express's conditional GET behavior
    app.use((req, res, next) => {
      if (req.path.includes('swagger') ||
        req.path.includes('docs-json') ||
        req.path.includes('docs-yaml') ||
        req.path.includes('api/documentation')) {

        // Override the res.send method to force fresh responses
        const originalSend = res.send;
        res.send = function (data) {
          // Set headers to prevent 304
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('Last-Modified', new Date().toUTCString()); // Always current time
          res.removeHeader('ETag'); // Remove ETag completely

          return originalSend.call(this, data);
        };
      }
      next();
    });

    const swaggerOptions: SwaggerCustomOptions = {
      useGlobalPrefix: false,
      swaggerUiEnabled: true,
      jsonDocumentUrl: '/v2/swagger/docs-json', // Remove version from here
      yamlDocumentUrl: '/v2/swagger/docs-yaml', // Remove version from here
      swaggerUrl: '/v2/swagger/docs-json', // Remove version from here
      customSiteTitle: 'Customer Service API Docs',
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@latest/swagger-ui.css', // Remove version
      customJs: [
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@latest/swagger-ui-bundle.js', // Remove version
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@latest/swagger-ui-standalone-preset.js', // Remove version
      ],
      explorer: true,
      swaggerOptions: {
        tagsSorter: 'alpha',
        apiSorter: 'alpha',
        url: '/v2/swagger/docs-json', // Remove version from here too
        authAction: {
          JWT: {
            name: 'JWT',
            schema: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: '',
            },
            value: 'Bearer <JWT>',
          },
        },
      },
    };

    SwaggerModule.setup('api/documentation', app, document, swaggerOptions);
  }
}
