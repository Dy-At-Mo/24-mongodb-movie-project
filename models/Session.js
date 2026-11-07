import mongoose from "mongoose";
import crypto from "crypto";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

// Create new session
sessionSchema.statics.createSession = async function (userId) {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const session = await this.create({
    sessionId,
    user: userId,
  });

  return session;
};

// Validate session
sessionSchema.statics.validateSession = async function (sessionId) {
  const session = await this.findOne({ sessionId }).populate("user");

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await session.deleteOne();
    return null;
  }

  if (!session.user) {
    return null;
  }

  return session;
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;
