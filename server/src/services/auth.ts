import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import userRepository from "../repositories/User";
import ApiError from "../utils/ApiError";
import { AuthCredentialsDto } from "../validators/auth";

type AuthTokenPayload = {
  sub: string;
  email: string;
};

export async function signupService(credentials: AuthCredentialsDto) {
  const existingUser = await userRepository.getUserByEmail(credentials.email);
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(credentials.password, 12);
  const user = await userRepository.createUser({
    email: credentials.email,
    passwordHash,
  });

  return {
    user,
    token: signAuthToken({ sub: user.id, email: user.email }),
  };
}

export async function loginService(credentials: AuthCredentialsDto) {
  const user = await userRepository.getUserByEmail(credentials.email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token: signAuthToken({ sub: user.id, email: user.email }),
  };
}

export async function getCurrentUserService(userId: string) {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new ApiError(401, "Authentication required");
  }
  return user;
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: `${env.AUTH_COOKIE_MAX_AGE_DAYS}d`,
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
