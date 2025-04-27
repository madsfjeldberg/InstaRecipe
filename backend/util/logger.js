import morgan from "morgan";

morgan.token("date", () => {
  return new Date().toLocaleString();
});
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const logger = morgan(':method :url :status - :response-time ms - :date[iso]');

export default logger;
