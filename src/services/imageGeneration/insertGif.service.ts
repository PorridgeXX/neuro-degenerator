import type { Canvas } from "@napi-rs/canvas";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import type { DemotivatorLayout } from "./calculateLayout";
import type { RandomMedia } from "@/services/telegram";

export async function insertGifIntoTemplate(
  template: Canvas,
  media: RandomMedia,
  layout: DemotivatorLayout,
): Promise<Buffer> {
  const workDir = await mkdtemp(path.join(tmpdir(), "demotivator-"));
  const templatePath = path.join(workDir, "template.png");
  const outputPath = path.join(workDir, "output.mp4");

  try {
    await writeFile(templatePath, await template.encode("png"));

    const filter =
      `[1:v]scale=${layout.media.width}:${layout.media.height}[gif];` +
      `[0:v][gif]overlay=${layout.media.x}:${layout.media.y}:shortest=1`;

    await runFfmpeg([
      "-loop",
      "1",
      "-i",
      templatePath,
      "-i",
      media.path,
      "-filter_complex",
      filter,
      "-r",
      "25",
      "-threads",
      "3",
      "-c:v",
      "libx264",
      "-profile:v",
      "high444",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-y",
      outputPath,
    ]);

    return await readFile(outputPath);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegInstaller.path, args);
    let stderr = "";
    proc.stderr.on("data", (c) => {
      stderr += c.toString();
    });
    proc.on("close", (code) => {
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg exited ${code}:\n${stderr}`));
    });
    proc.on("error", reject);
  });
}
