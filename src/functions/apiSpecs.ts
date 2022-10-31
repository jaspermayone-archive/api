import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Heptagram API",
      version: process.env.npm_package_version as string,
      description:
        "Basic API, designed and coded for the @Heptagram-Bot-Project",
      termsOfService: "https://heptagrambotproject.com/tos",
      license: {
        name: "Eclipse Public License 2.0 (EPL-2.0)",
        url: "https://opensource.org/licenses/EPL-2.0",
      },
      contact: {
        name: "Heptagram-Bot-Project",
        url: "heptagrambotproject.com",
        email: "jasper@jaspermayone.com",
      },
    },
    basePath: "/",
    tags: [
      { name: "/", description: "Main API Endpoints" },
      { name: "/auth", description: "Authentication Endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
};

export const apiSpecs = swaggerJsdoc(options);
