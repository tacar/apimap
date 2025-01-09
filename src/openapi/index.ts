import { schemas } from "./schemas";
import { userPaths } from "./paths/users";
import { todoPaths } from "./paths/todos";
import { securitySchemes } from "./security";

export const openApiSchema = {
  openapi: "3.0.3",
  info: {
    title: "Todo API Documentation",
    version: "1.0.0",
    description: "Todo and User Management API",
  },
  servers: [
    {
      url: "https://apiwalk.tacarz.workers.dev",
      description: "Production server",
    },
    {
      url: "http://localhost:8787",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Users", description: "User management endpoints" },
    { name: "Todo", description: "Todo management endpoints" },
  ],
  paths: {
    ...userPaths,
    ...todoPaths,
  },
  components: {
    schemas,
    securitySchemes,
  },
};
