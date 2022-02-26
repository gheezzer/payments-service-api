const {
  env: { NODE_ENV },
} = process;

const getErrorName = ({ name }) => {
  const isGenericError = !name || name === 'Error';
  return isGenericError ? 'InternalServerError' : name;
};

const isError = error => error instanceof Error;

export default (error, _request, response, next) => {
  if (!isError(error)) return next();

  const {
    statusCode = 500,
    message = 'Internal Server Error',
    details,
  } = error || {};

  const errorBody = {
    message,
    statusCode,
    error: getErrorName(error),
    details,
  };

  if (['local', 'development'].includes(NODE_ENV)) {
    errorBody.stack = error.stack;
  }

  return response.status(statusCode).json(errorBody);
};
