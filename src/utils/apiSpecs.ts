import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    info: {
      title: "Heptagram API",
      version: process.env.npm_package_version || "0.0.0",
      description:
        "Basic API, designed and coded for the @Heptagram-Bot-Project",
    },
    tags: [
      {name: "/api/v0", description: "API version 0 endpoints"},
      {name: "/admin", description: "Admin endpoints"},
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
};

export const apiSpecs = swaggerJsdoc(options);
