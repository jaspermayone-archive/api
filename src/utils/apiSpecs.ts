import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    info: {
      title: "Heptagram API",
      version: process.env.npm_package_version,
      description:
        "Basic API, designed and coded for the @Heptagram-Bot-Project",
    },
    tags: [
      { name: "/v4", description: "API Version 4 Endpoints" },
      { name: "/auth", description: "Authentication Endpoints" },
      { name: "/metrics", description: "Metrics Endpoints" },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
};

export const apiSpecs = swaggerJsdoc(options);
