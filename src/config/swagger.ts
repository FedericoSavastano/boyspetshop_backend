import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'PetshopProducts',
                description: 'API operations related to products',
            },
        ],
        info: {
            title: 'REST API for Boys Pet Shop',
            version: '1.0.0',
            description: 'API Docs for Products',
        },
    },
    apis: ['./src/router.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://res.cloudinary.com/dd1gptapb/image/upload/v1741363233/BOYS__1_-removebg-preview_ctosnh.png');
            height: 120px;
            width: auto;
        }
    `,
    customSiteTitle: 'Boys Pet Shop REST API documentation',
};
export default swaggerSpec;
export { swaggerUiOptions };
