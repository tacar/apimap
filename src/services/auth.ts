import { Bindings } from "../types";
import { createClient } from "@libsql/client/web";

// sqlタグ付きテンプレートリテラルを定義
function sql(strings: TemplateStringsArray, ...values: any[]) {
  return { strings, values };
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

function getFirebaseConfig(c: { env: Bindings }) {
  console.log("Environment variables:", {
    FIREBASE_API_KEY: c.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: c.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_STORAGE_BUCKET: c.env.FIREBASE_STORAGE_BUCKET,
    DEEPSEEK_API_URL: c.env.DEEPSEEK_API_URL,
    ALLOWED_ORIGINS: c.env.ALLOWED_ORIGINS,
    NODE_ENV: c.env.NODE_ENV,
    TURSO_DB_URL: c.env.TURSO_DB_URL,
  });

  const apiKey = c.env.FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("FIREBASE_API_KEY is not set");
    throw new Error("Firebase API Key is not configured");
  }
  return { apiKey };
}

export async function createUser(data: CreateUserData, c: { env: Bindings }) {
  const { email, password, name } = data;
  let client;
  let userId;

  try {
    // まず、ユーザーが既に存在するか確認
    const existingUser = await searchUser(email, c);
    if (existingUser.exists) {
      return {
        success: false,
        error: "User with this email already exists",
        code: "EMAIL_EXISTS",
      };
    }

    // 1. DBにユーザーを登録
    try {
      client = createClient({
        url: c.env.TURSO_DB_URL,
        authToken: c.env.TURSO_DB_AUTH_TOKEN,
      });

      console.log("DB Connection Config:", {
        url: c.env.TURSO_DB_URL,
        hasAuthToken: !!c.env.TURSO_DB_AUTH_TOKEN,
      });

      const dbResult = await client.execute(
        `
        INSERT INTO users (
          name,
          email,
          password,
          created_at,
          updated_at
        ) VALUES (
          ?,
          ?,
          ?,
          datetime('now'),
          datetime('now')
        ) RETURNING id
        `,
        [name, email, password]
      );

      console.log("DB Insert Result:", dbResult);
      userId = dbResult.rows[0].id;
    } catch (dbError) {
      console.error("DB Connection/Insert Error:", dbError);
      throw dbError;
    }

    // 2. Firebaseでユーザーを作成
    const { apiKey } = getFirebaseConfig(c);
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        displayName: name,
        returnSecureToken: true,
      }),
    }).then((res) => res.json());

    if (response.error) {
      // Firebaseでエラーが発生した場合、DBから削除
      await client.execute("DELETE FROM users WHERE id = ?", [userId]);
      return {
        success: false,
        error: response.error.message,
        code: response.error.message,
      };
    }

    // 3. DBのユーザーレコードを更新してfirebase_uidを保存
    await client.execute(
      `
      UPDATE users
      SET firebase_uid = ?
      WHERE id = ?
      `,
      [response.localId, userId]
    );

    return {
      success: true,
      data: {
        id: userId,
        firebase_id: response.localId,
        email: response.email,
        name: response.displayName || name,
      },
    };
  } catch (error) {
    console.error("Create user error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      code: "INTERNAL_ERROR",
    };
  }
}

export async function signInUser(data: SignInData, c: { env: Bindings }) {
  const { email, password } = data;

  try {
    const { apiKey } = getFirebaseConfig(c);
    console.log("Sign In - API Key:", apiKey);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    console.log("Sign In - Request URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }).then((res) => res.json());

    console.log("Firebase response:", response);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      success: true,
      token: response.idToken,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function listUsers(c: { env: Bindings }) {
  try {
    const { apiKey } = getFirebaseConfig(c);
    console.log("List Users - API Key:", apiKey);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:query?key=${apiKey}`;
    console.log("List Users - Request URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).then((res) => res.json());

    console.log("Firebase response:", response);

    if (response.error) {
      console.error("List users error:", response.error);
      throw new Error(response.error.message);
    }

    return {
      success: true,
      users:
        response.users?.map((user: any) => ({
          id: user.localId,
          email: user.email,
          name: user.displayName,
        })) || [],
    };
  } catch (error) {
    console.error("List users error:", error);
    throw error;
  }
}

export async function searchUser(email: string, c: { env: Bindings }) {
  try {
    const { apiKey } = getFirebaseConfig(c);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: [email],
      }),
    }).then((res) => res.json());

    // USER_NOT_FOUNDの場合は正常なレスポンスとして扱う
    if (response.error && response.error.message === "USER_NOT_FOUND") {
      return {
        success: true,
        exists: false,
        message: "User not found",
      };
    }

    if (response.error) {
      console.error("Search user error:", response.error);
      return {
        success: false,
        error: response.error.message,
        code: response.error.message,
      };
    }

    return {
      success: true,
      exists: response.users && response.users.length > 0,
      message:
        response.users && response.users.length > 0
          ? "User found"
          : "User not found",
    };
  } catch (error) {
    console.error("Search user error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      code: "INTERNAL_ERROR",
    };
  }
}

export async function updateLastLogin(email: string, c: { env: Bindings }) {
  try {
    const { apiKey } = getFirebaseConfig(c);
    console.log("Update Last Login - API Key:", apiKey);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
    console.log("Update Last Login - Request URL:", url);

    const now = new Date().toISOString();
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        customAttributes: {
          last_login_at: now,
        },
      }),
    }).then((res) => res.json());

    console.log("Firebase response:", response);

    if (response.error) {
      if (response.error.message === "USER_NOT_FOUND") {
        throw new Error("User not found");
      }
      throw new Error(response.error.message);
    }

    return {
      success: true,
      message: "Last login time updated successfully",
      data: {
        email,
        last_login_at: now,
      },
    };
  } catch (error) {
    console.error("Update last login error:", error);
    throw error;
  }
}
