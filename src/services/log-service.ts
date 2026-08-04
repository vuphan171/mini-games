const LoggerService = {
  logError: (error: unknown) => {
    console.log(JSON.stringify(error, null, 2));
  },
  logWarning: (message: string) => {
    console.warn(message);
  },
  logInfo: (message: string) => {
    console.info(message);
  },
  logDebug: (message: string) => {
    console.debug(message);
  },
};

export { LoggerService };
