import multer from "multer";
import { randomUUID } from "node:crypto";
import path from "node:path";

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error("Only JPG, JPEG, PNG, WEBP, and GIF images are allowed")
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// handle Multer errors
function handleUploadError(err, field, res, next) {
  if (!err) {
    return next();
  }

  let message = err.message;

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image size must not exceed 5MB";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field or too many files";
    }
  }

  return res.status(422).json({
    errors: {
      [field]: {
        errors: [message],
      },
    },
  });
}

// Upload one image
export function uploadImage(field) {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      handleUploadError(err, field, res, next);
    });
  };
}

// Upload more than images
export function uploadImages(field, maxCount = 5) {
  return (req, res, next) => {
    upload.array(field, maxCount)(req, res, (err) => {
      handleUploadError(err, field, res, next);
    });
  };
}
