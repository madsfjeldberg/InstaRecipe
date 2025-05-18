const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).send({
    errorMessage: err.message || 'Internal Server Error'
  });
};

export default globalErrorHandler;
