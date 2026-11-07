import express from "express";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

import { checkAuth } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

import { createReviewSchema , updateReviewSchema } from "../validation-schemas/review.schema.js";





export const reviewRouter = express.Router();


// create reviews by movieId
reviewRouter.post(
  "/:movieId",
  checkAuth,
  validateObjectId,
  validateBody(createReviewSchema),
  async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.movieId);

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
    } catch (error) {
      next(error);
    }
  }
);



// get reviews my
reviewRouter.get("/my", checkAuth, async (req, res, next) => {
  try {
    const reviews = await Review.find({
      user: req.user.id,
    }).populate("movie", "title year image");

    return res.status(200).json({
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});



// updatya reviews by id
reviewRouter.patch(
  "/:id",
  checkAuth,
  validateObjectId,
  validateBody(updateReviewSchema),
  async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          error: "review not found",
        });
      }

      // Check review ownership
      if (review.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          error: "you are not authorized to update this review",
        });
      }

      Object.assign(review, req.body);

      await review.save();

      return res.status(200).json({
        message: "review updated successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }
);





// deldte reviews byid
reviewRouter.delete(
  "/:id",
  checkAuth,
  validateObjectId,
  async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          error: "review not found",
        });
      }

      // Check review ownership 
      if (review.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          error: "you are not authorized to delete this review",
        });
      }

      await review.deleteOne();

      return res.status(200).json({
        message: "review deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);
