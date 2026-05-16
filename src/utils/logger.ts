import pino from "pino";

export const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          destination: 1,
          colorize: true,
          translateTime: "SYS:HH:MM:ss.l",
          ignore: "pid,hostname",
        },
        level: "info",
      },
      {
        target: "pino-pretty",
        options: {
          destination: "./logs/app.log",
          mkdir: true,
          colorize: false,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
          ignore: "pid,hostname",
        },
        level: "info",
      },
    ],
  },
});
