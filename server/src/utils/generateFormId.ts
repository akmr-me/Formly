import { AlphabetString, ShortFormIdLength } from "../constants";

export function generateFormId(): string {
  let result = "";
  const charactersLength = AlphabetString.length;
  for (let i = 0; i < ShortFormIdLength; i++) {
    result += AlphabetString.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
}
