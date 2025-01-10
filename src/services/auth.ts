import { cert } from "@hono/firebase-auth";

// Firebase Admin初期化
const config = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function createUser(data: CreateUserData) {
  const { email, password, name } = data;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        displayName: name,
        returnSecureToken: true,
      }),
    }
  ).then((res) => res.json());

  return {
    success: true,
    data: {
      id: response.localId,
      email: response.email,
      name: response.displayName,
    },
  };
}

export async function signInUser(data: SignInData) {
  const { email, password } = data;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  ).then((res) => res.json());

  return {
    success: true,
    token: response.idToken,
  };
}

export async function listUsers() {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:query?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }
  ).then((res) => res.json());

  return {
    success: true,
    users: response.users.map((user: any) => ({
      id: user.localId,
      email: user.email,
      name: user.displayName,
    })),
  };
}

export async function searchUser(email: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: [email],
      }),
    }
  ).then((res) => res.json());

  return {
    success: true,
    exists: response.users && response.users.length > 0,
    message:
      response.users && response.users.length > 0
        ? "User found"
        : "User not found",
  };
}

export async function updateLastLogin(email: string) {
  const now = new Date().toISOString();

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        customAttributes: {
          last_login_at: now,
        },
      }),
    }
  ).then((res) => res.json());

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
}
