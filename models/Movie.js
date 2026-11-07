import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1888,
      max: 2100,
    },

    genres: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    trailerLink: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    director: {
      type: String,
      required: true,
    },

    actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Get movie reviews
movieSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "movie",
});

//   Search movies by title
movieSchema.statics.searchMovies = function (search) {
  if (!search) return this.find();

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return this.find({
    title: { $regex: escapedSearch, $options: "i" },
  });
};

//  delete reviews when movie is deleted
movieSchema.pre("findOneAndDelete", async function () {
  const movie = await this.model.findOne(this.getFilter()).select("_id");

  if (movie) {
    await mongoose.model("Review").deleteMany({
      movie: movie._id,
    });
  }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
