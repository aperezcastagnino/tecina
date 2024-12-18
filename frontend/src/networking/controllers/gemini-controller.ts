import { deSerialize } from "networking/serializers/gemini-paraphrase-serializer";
import { ApiService } from "networking/api-service";
import { API_ROUTES } from "networking/api-routes";

export const getParaphrase = async (
  prompt: string,
): Promise<GeminiParaphrase> => {
  console.log(API_ROUTES);
  console.log("EHEHEHHEHEHE");
  const response = await ApiService.get<RawGeminiParaphrase>(
    `${API_ROUTES.GEMINI}?prompt=${encodeURIComponent(prompt)}`,
  );
  return deSerialize(response);
};
