import { test, expect, describe } from "bun:test";
import { parseGenerationOutput } from "@/parsers";

describe("generation output parser", () => {
  test("input 2 lines", () => {
    const input = "first line\nsecond line";
    expect(parseGenerationOutput(input)).toEqual({
      title: "first line",
      subtitle: "second line",
    });
  });

  test("input 2 lines with spaces", () => {
    const input = " \n first line \n second line ";
    expect(parseGenerationOutput(input)).toEqual({
      title: "first line",
      subtitle: "second line",
    });
  });
  test("input 3 lines", () => {
    const input = " \n first line \n second line \n third line ";
    expect(parseGenerationOutput(input)).toEqual({
      title: "first line",
      subtitle: "second line",
    });
  });

  test("input 1 line", () => {
    const input = "first line";
    expect(parseGenerationOutput(input)).toEqual({
      title: "first line",
      subtitle: "",
    });
  });

  test("input null", () => {
    expect(() => parseGenerationOutput(null)).toThrow();
  });

  test("input undefined", () => {
    expect(() => parseGenerationOutput(undefined)).toThrow();
  });

  test("input empty line", () => {
    expect(() => parseGenerationOutput("")).toThrow();
    expect(() => parseGenerationOutput("\n")).toThrow();
    expect(() => parseGenerationOutput(" \n ")).toThrow();
  });
});
