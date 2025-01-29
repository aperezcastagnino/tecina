export const deSerialize = (data: RawGeminiParaphrase): GeminiParaphrase => ({
  initialPrompt: data.initial_prompt,
  paraphrase: data.paraphrase,
});

export const serialize = (data: GeminiParaphrase): RawGeminiParaphrase => ({
  initial_prompt: data.initialPrompt,
  paraphrase: data.paraphrase,
});
