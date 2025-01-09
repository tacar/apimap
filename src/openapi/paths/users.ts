export const userPaths = {
  "/api/users/add": {
    post: {
      summary: "Register a new user",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 6 },
                name: { type: "string", minLength: 1 },
              },
              required: ["email", "password", "name"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" },
            },
          },
        },
      },
    },
  },
  // ... 他のユーザー関連パス
};
