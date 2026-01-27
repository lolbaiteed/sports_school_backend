import { ApiError } from "./ApiError";

export function checkInput(ObjEntry: object) {
  for (const [key, value] of Object.entries(ObjEntry)) {
    if (value === undefined || value === null || value === "") {
      throw new ApiError(400, "BAD_REQUEST", `${key} is required`);
    }
  }
}
