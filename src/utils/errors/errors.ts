import { AppError } from "./base.errors";

export class InvalidInputError extends AppError {
  constructor(what: string, options?: ErrorOptions) {
    super(`Invalid input: ${what}`, options);
  }
}

export class GenerationFormatError extends AppError {
  constructor(
    public readonly output: string | null | undefined,
    options?: ErrorOptions,
  ) {
    super(`Deepseek can't generate!: ${JSON.stringify(output)}`, options);
  }
}

export class NotEnoughMessagesError extends AppError {
  constructor(
    public readonly count: number,
    public readonly required: number,
  ) {
    super(`Not enough messages: ${count} < ${required}`);
  }
}

export class NoMediaError extends AppError {
  constructor(public readonly chatId: number) {
    super(`No media in ${chatId} =(`);
  }
}
