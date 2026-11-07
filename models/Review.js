import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    comment: {
      type: String,
      trim: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//  Find reviews by movie
reviewSchema.statics.findByMovie = function (movieId) {
  return this.find({ movie: movieId });
};

//  Find reviews by user
reviewSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId });
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
