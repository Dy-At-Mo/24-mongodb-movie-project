import mongoose from "mongoose";
import Movie from "./Movie.js";

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    birthdate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual=   Get actors movies
actorSchema.virtual("movies", {
  ref: "Movie",
  localField: "_id",
  foreignField: "actors",
});

// Static => Search actors by name
actorSchema.statics.searchByName = function (name) {
  if (!name) return this.find();

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return this.find({
    name: { $regex: escapedName, $options: "i" },
  });
};


// Remove actor reference from all movies before deleting actor 
actorSchema.pre("findOneAndDelete", async function () {
  const actor = await this.model.findOne(this.getFilter());

  if (actor) {
    await Movie.updateMany(
      { actors: actor._id },
      { $pull: { actors: actor._id } }
    );
  }
});




const Actor = mongoose.model("Actor", actorSchema);

export default Actor;
