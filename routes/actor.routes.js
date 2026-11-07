import express from "express";
import Actor from "../models/Actor.js";

import { checkAuth } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { uploadImages } from "../middleware/upload.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

import { createActorSchema , updateActorSchema } from "../validation-schemas/actor.schema.js";


export const actorRouter = express.Router();

// creaate actors
actorRouter.post(
  "/",
  checkAuth,
  uploadImages("images", 5),
  validateBody(createActorSchema),
  async (req, res, next) => {
    try {
      const images = req.files?.map((file) => file.filename) || [];

      const actor = await Actor.create({
        ...req.body,
        images,
      });

      return res.status(201).json({
        message: "Actor created successfully",
        data: actor,
      });
    } catch (error) {
      next(error);
    }
  }
);




// Get or serch all actors
actorRouter.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const actors = await Actor.find(filter);

    return res.status(200).json({
      data: actors,
    });
  } catch (error) {
    next(error);
  }
});


// get actors byid
actorRouter.get("/:id",
  validateObjectId,
  async (req, res, next) => {
    try {
      const actor = await Actor.findById(req.params.id)
        .populate("movies", "title year image");

      if (!actor) {
        return res.status(404).json({
          error: "actor not found",
        });
      }

      return res.status(200).json({
        data: actor,
      });
    } catch (error) {
      next(error);
    }
  }
);


// updata actors by id
actorRouter.patch(
  "/:id",
  checkAuth,
  validateObjectId,
  uploadImages("images", 5),
  validateBody(updateActorSchema),
  async (req, res, next) => {
    try {
      const actor = await Actor.findById(req.params.id);

      if (!actor) {
        return res.status(404).json({
          error: "actor not found",
        });
      }

      // Update text 
      Object.assign(actor, req.body);

      // replace old image
      if (req.files && req.files.length > 0) {
        actor.images = req.files.map((file) => file.filename);
      }

      await actor.save();

      return res.status(200).json({
        message: "actor updated successfully",
        data: actor,
      });
    } catch (error) {
      next(error);
    }
  }
);






// DELETE 
actorRouter.delete(
  "/:id",
  checkAuth,
  validateObjectId,
  async (req, res, next) => {
    try {
      const actor = await Actor.findByIdAndDelete(req.params.id);

      if (!actor) {
        return res.status(404).json({
          error: "actor not found",
        });
      }

      return res.status(200).json({
        message: "actor deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);
