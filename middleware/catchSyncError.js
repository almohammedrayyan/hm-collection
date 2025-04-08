module.exports = (functionThun) => (req, res, next) => {
    Promise.resolve(functionThun(req, res, next)).catch(next);
  };
  