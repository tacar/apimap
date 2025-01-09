export const imagePaths = {
  "/api/images/upload": {
    post: {
      summary: "Upload an image",
      tags: ["Images"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                },
              },
              required: ["file"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Image uploaded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { $ref: "#/components/schemas/ImageResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/images/{id}": {
    get: {
      summary: "Get an image",
      tags: ["Images"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Image file",
          content: {
            "image/*": {
              schema: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
  },
};
