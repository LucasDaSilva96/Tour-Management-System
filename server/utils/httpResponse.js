// *? Helper functions
// This function is in charge of the response-status and message
exports.responseHelper = (statusCode, message, res, data) => {
  let status;

  if (statusCode >= 200 && statusCode < 400) status = 'success';
  if (statusCode >= 400) status = 'fail';

  if (!data) {
    res.status(statusCode).json({
      status,
      message: message,
    });
  } else {
    res.status(statusCode).json({
      status,
      message: message,
      data: {
        data,
      },
    });
  }
};
