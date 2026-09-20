export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  if (err.name === "ValidationError") {
    return res.status(422).json({ message: Object.values(err.errors).map(e => e.message).join(", ") });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with this unique value already exists." });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID." });
  }
  const status = err.statusCode || 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error." : err.message
  });
}
