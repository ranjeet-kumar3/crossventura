import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // path to your API folders
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CrossVentura API Documentation",
        version: "1.0.0",
        description: "API documentation for CrossVentura platform",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
