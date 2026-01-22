import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "ApiKey",
        in: "cookie",
        name: "access_token",
      },
    },
  },
  tags: [
    {
      name: "Admin",
      description: "Admin-only endpoints",
    },
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Users",
      description: "User management",
    }
  ],
  apis: ["./src/routes/**/*.ts", "./components.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
