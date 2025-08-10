import { customAlphabet } from "nanoid";

export const generateFormId = customAlphabet(
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  8
);
