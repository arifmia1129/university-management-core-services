import app from "./app";
import config from "./config";
import { errorLogger, infoLogger } from "./shared/logger";
import { Server } from "http";
import { RedisClient } from "./shared/redis";

let server: Server;

process.on("uncaughtException", err => {
  if (server) {
    server.close(() => {
      errorLogger.error(err);
      process.exit(1);
    });
  } else {
    errorLogger.error(err);
    process.exit(1);
  }
});
async function main() {
  try {
    await RedisClient.connect();
    server = app.listen(config.port, () => {
      infoLogger.info(`Application is listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error("Failed to connect database", error);
  }

  process.on("unhandledRejection", err => {
    if (server) {
      server.close(() => {
        errorLogger.error(err);
        process.exit(1);
      });
    } else {
      errorLogger.error(err);
      process.exit(1);
    }
  });
}

main();

process.on("SIGTERM", () => {
  infoLogger.info("SIGTERM received");
  process.exit(1);
});
