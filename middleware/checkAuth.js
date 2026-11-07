import Session from "../models/Session.js";

export async function checkAuth(req, res, next) {
  try {
    const sessionId = req.cookies?.movie_session;

    if (!sessionId) {
      return res.status(401).json({
        error: "invalid session",
      });
    }

    const session = await Session.validateSession(sessionId);

    if (!session) {
      return res.status(401).json({
        error: "invalid session",
      });
    }

    req.user = {
      id: session.user._id,
      username: session.user.username,
      email: session.user.email,
      image: session.user.image,
    };

    next();
  } catch (err) {
    next(err);
  }
}