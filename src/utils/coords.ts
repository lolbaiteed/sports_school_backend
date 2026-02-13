import { ApiError } from "./ApiError";

export function getCoordsFromYandexUrl(url: string): { longitude: number; latitude: number } {
  try {
    const parsed = new URL(url);
    const llParam = parsed.searchParams.get("ll");

    if (!llParam) throw new ApiError(400, "BAD_REQUEST", "Invalid URL");

    // Yandex uses "longitude,latitude"
    const [lon, lat] = llParam.split(",").map(Number);

    if (isNaN(lon) || isNaN(lat)) throw new ApiError(400, "BAD_REQUEST", "Invalid URL");

    return { longitude: lon, latitude: lat };
  } catch (error) {
    console.error("Invalid URL:", error);
    throw new ApiError(400, "BAD_REQUEST", "Invalid URL");
  }
}
