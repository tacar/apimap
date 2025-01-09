export const todoPaths = {
  "/api/todos": {
    get: {
      summary: "Get all todos",
      tags: ["Todo"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "List of todos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/TodoResponse" },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ... 他のTodo関連パス
  },
};
