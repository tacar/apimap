import { Context } from "hono";
import { Bindings } from "../../types";

export const loginHandler = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();

    console.log("ログイン試行:", email);

    const apiKey = c.env.FIREBASE_API_KEY;
    console.log("API Key exists:", !!apiKey);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();
      console.log("Firebase応答:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "Unknown error");
      }

      return c.json({
        success: true,
        token: data.idToken,
        user: {
          uid: data.localId,
          email: data.email,
        },
      });
    } catch (error) {
      console.error("Firebase認証の詳細エラー:", error);
      return c.json(
        {
          error: "ログインに失敗しました",
          details: error instanceof Error ? error.message : String(error),
        },
        401
      );
    }
  } catch (error) {
    console.error("ログインエラー:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
