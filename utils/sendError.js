exports.sendError = (res, error, status = 200) => {
  res.status(status).json({ success: false, error });
};
