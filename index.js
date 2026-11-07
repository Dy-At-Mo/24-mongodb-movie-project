import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/index.js";
import { pagesRouter } from "./routes/pages.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { movieRouter } from "./routes/movie.routes.js";
import { actorRouter } from "./routes/actor.routes.js";
import { reviewRouter } from "./routes/review.routes.js";

process.loadEnvFile();

const app = express();
app.use(express.json());
app.use(cookieParser());

// uploaded images
app.use("/uploads", express.static("uploads"));



app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});




// Rou
app.use("/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/actors" , actorRouter)
app.use("/api/reviews" , reviewRouter)
app.use(pagesRouter);




app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ error: "something went wrong" });
});

const PORT = process.env.PORT || 3000;
await connectDB();

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
