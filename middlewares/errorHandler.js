// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  console.log(err);

  res.status(status).send({
    message: status === 500 ? "Произошла внутренняя ошибка" : err.message,
  });
};

module.exports = errorHandler;
