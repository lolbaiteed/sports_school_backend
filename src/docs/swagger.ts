import swaggerJSDoc from "swagger-jsdoc";

export const openApiSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
    tags: [
      {
        name: "Auth",
        description: "Auth endpoints",
      },
      {
        name: "Student",
        description: "Student endpoints",
      },
      {
        name: "Coach",
        description: "Coach endpoints",
      },
      {
        name: "Event",
        description: "Event endpoints",
      },
      {
        name: "Files",
        description: "Files endpoints",
      },
    ],
    security: [{ cookieAuth: [] }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: {
              type: 'string',
              example: 'INVALID_TOKEN',
            },
            message: {
              type: 'string',
              example: 'Authentication token is missing or invalid',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        ImageUpload: {
          type: 'object',
          required: ['filename', 'size', 'url', 'mimeType'],
          properties: {
            filename: {
              type: 'string',
              example: 'test',
            },
            size: {
              type: 'integer',
              example: '512',
            },
            url: {
              type: 'string',
              example: 'uploads/test.png',
            },
            mimeType: {
              type: 'string',
              example: 'image/png',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});
