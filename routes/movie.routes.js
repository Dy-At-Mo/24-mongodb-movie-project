import express from "express";

import Movie from "../models/Movie.js";
import Actor from "../models/Actor.js";
import Review from "../models/Review.js";

import { checkAuth } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { uploadImage } from "../middleware/upload.js";

import {createMovieSchema, updateMovieSchema } from "../validation-schemas/movie.schema.js";
import { createReviewSchema } from "../validation-schemas/review.schema.js";

export const movieRouter = express.Router();



// GET all movies
movieRouter.get("/", async (req, res, next) => {
  try {
    const { search, actor } = req.query;

    const filter = {};

    // Search by movie title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // filter by actor iD
    if (actor) {
      if (!/^[a-f\d]{24}$/i.test(actor)) {
        return res.status(400).json({
          error: "invalid id",
        });
      }

      filter.actors = actor;
    }

    const movies = await Movie.find(filter).populate(
      "actors",
      "name images birthdate"
    );

    return res.status(200).json({
      data: movies,
    });
  } catch (err) {
    next(err);
  }
});


// get movies by id
movieRouter.get("/:id", validateObjectId, async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("actors", "name images birthdate")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username image",
        },
      });

    if (!movie) {
      return res.status(404).json({
        error: "movie not found",
      });
    }

    return res.status(200).json({
      data: movie,
    });
  } catch (err) {
    next(err);
  }
});



// create movies
movieRouter.post("/",
  checkAuth,
  uploadImage("image"),
  validateBody(createMovieSchema),
  async (req, res, next) => {
    try {
      const movie = await Movie.create({
        ...req.body,
        image: req.file?.filename,
      });

      return res.status(201).json({
        message: "movie created successfully",
        data: movie,
      });
    } catch (err) {
      next(err);
    }
  }
);



// updata movies by id
movieRouter.patch("/:id",
  checkAuth,
  validateObjectId,
  uploadImage("image"),
  validateBody(updateMovieSchema),
  async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);

      if (!movie) {
        return res.status(404).json({
          error: "movie not found",
        });
      }

      Object.assign(movie, req.body);

      // Replace 
      if (req.file) {
        movie.image = req.file.filename;
      }

      await movie.save();

      return res.status(200).json({
        message: "movie updated successfully",
        data: movie,
      });
    } catch (err) {
      next(err);
    }
  }
);


// Delete movies by id
movieRouter.delete("/:id",
  checkAuth,
  validateObjectId,
  async (req, res, next) => {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id);

      if (!movie) {
        return res.status(404).json({
          error: "movie not found",
        });
      }

      return res.status(200).json({
        message: "movie deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
);



// create reviews from movies by id
movieRouter.post("/:id/reviews",
  checkAuth,
  validateObjectId,
  validateBody(createReviewSchema),
  async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);

      if (!movie) {
        return res.status(404).json({
          error: "movie not found",
        });
      }

      const review = await Review.create({
        ...req.body,
        movie: movie._id,
        user: req.user.id,
      });

      return res.status(201).json({
        message: "review added successfully",
        data: review,
      });
    } catch (err) {
      next(err);
    }
  }
);
