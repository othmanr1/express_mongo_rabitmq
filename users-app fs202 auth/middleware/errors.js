function errorHandler(err, req, res, next) {
    // Set the default status code to 500 (Internal Server Error)
    let statusCode = 500;
  
    // Set the error message based on the error object
    let message = err.message;
  
    // Determine the status code based on the error type
    if (err instanceof SyntaxError) {
      statusCode = 400; // Bad Request
      message = 'Invalid JSON';
    } else if (err.name === 'ValidationError') {
      statusCode = 422; // Unprocessable Entity
      message = err.details.map(d => d.message).join(', ');
    } else if (err.code === 'ENOENT') {
      statusCode = 404; // Not Found
      message = 'Resource not found';
    } else if (err.code === 'ECONNREFUSED') {
      statusCode = 503; // Service Unavailable
      message = 'Service unavailable';
    }else if (err.status === 401) {
        statusCode = 401; // Unauthorized
        message = 'Unauthorized';
      }
  
    // Set the response status code and send the error message to the client
    res.status(statusCode).json({
      error: {
        message: message,
      },
    });
  }
  
  module.exports = errorHandler;
  