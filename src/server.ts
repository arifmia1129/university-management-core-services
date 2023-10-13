import app from "./app";
import config from "./config";
import { infoLogger, errorLogger } from "./shared/logger";
import { RedisClient } from "./shared/redis";
import subscribeEvents from "./app/events";

async function startServer() {
  try {
    await RedisClient.connect();
    await subscribeEvents();
    const server = app.listen(config.port, () => {
      infoLogger.info(`Application is listening on port ${config.port}`);
    });

    process.on("SIGTERM", () => {
      server.close(() => {
        infoLogger.info("Server is gracefully shutting down.");
        process.exit(0);
      });
    });

    process.on("unhandledRejection", (reason, promise) => {
      errorLogger.error("Unhandled Rejection at:", reason, "Promise:", promise);
    });

    process.on("uncaughtException", error => {
      errorLogger.error("Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error) {
    errorLogger.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
