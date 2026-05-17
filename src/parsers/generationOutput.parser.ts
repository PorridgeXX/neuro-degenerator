import { GenerationFormatError } from "@/utils";

export type GenerationOutput = {
  title: string;
  subtitle: string;
};

export const parseGenerationOutput = (
  content: string | null | undefined,
): GenerationOutput => {
  if (!content) throw new GenerationFormatError(content);

  const [title, subtitle] = content.trim().split("\n");

  if (!title) throw new GenerationFormatError(content);
  return {
    title: title.trim(),
    subtitle: (subtitle ?? "").trim(),
  };
};
