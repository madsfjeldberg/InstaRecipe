import morgan from 'morgan';

morgan.token("date", () => {
  return new Date().toLocaleString();
});

const logger = morgan(":method :url :status - :response-time ms - :date[iso]");

export default logger;
