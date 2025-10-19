export default (err, req, res, next) => {
  err.status = err.status || 500;
  err.code = err.code || "ERROR";
  return res.status(err.status).json({
    code: err.code,
    message: err.message,
  });
};
