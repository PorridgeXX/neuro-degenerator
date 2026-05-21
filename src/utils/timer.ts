export class Timer {
  private static readonly DURATION_MS = 8000;
  private static stack = new Map<number, number>();

  static start(chatId: number) {
    Timer.stack.set(chatId, Date.now());
    setTimeout(() => this.stack.delete(chatId), this.DURATION_MS);
  }
  static getRemaining(chatId: number): number | undefined {
    const startedAt = Timer.stack.get(chatId);
    if (startedAt === undefined) return undefined;

    const elapsed = Date.now() - startedAt;
    return Math.max(0, Math.ceil((Timer.DURATION_MS - elapsed) / 1000));
  }

  static clear(chatId: number): void {
    Timer.stack.delete(chatId);
  }
}
