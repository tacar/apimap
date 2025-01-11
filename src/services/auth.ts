import { Bindings } from "../types";

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

  try {
    const { apiKey } = getFirebaseConfig(c);
    console.log("Create User - API Key:", apiKey);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    console.log("Create User - Request URL:", url);

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

    console.log("Firebase response:", response);

    if (response.error) {
      console.error("Firebase error:", response.error);
      throw new Error(response.error.message);
    }

    return {
      success: true,
      data: {
        id: response.localId,
        email: response.email,
        name: response.displayName || name,
      },
    };
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
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
    console.log("Search User - API Key:", apiKey);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    console.log("Search User - Request URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: [email],
      }),
    }).then((res) => res.json());

    console.log("Firebase response:", response);

    if (response.error) {
      console.error("Search user error:", response.error);
      throw new Error(response.error.message);
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
    throw error;
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
