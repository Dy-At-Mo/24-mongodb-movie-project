import mongoose from "mongoose";

export function validateObjectId(req, res, next) {
  const id = req.params.id || req.params.movieId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "invalid id",
    });
  }

  next();
}
