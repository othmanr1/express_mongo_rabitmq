const errorsHandler = async (err, req, res, next) => {
    switch (err.code) {
      case 'permission_denied':
        res.status(403).send('Forbidden');
        break;
      case 'not_found':
        res.status(404).send('Not Found');
        break;
      case 'validation_error':
        res.status(400).send('Validation Error');
        break;
      case 'server_error':
        res.status(500).send('Internal Server Error');
        break;
      default:
        res.status(500).send('Something went wrong');
        break;
    }
  };
  
  module.exports = errorsHandler;