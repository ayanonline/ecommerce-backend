const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");

require("dotenv").config();

require("aws-sdk/lib/maintenance_mode_message").suppress = true;

// AWS s3 configuration
const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  Bucket: process.env.AWS_BUCKET_NAME,
  signatureVersion: "v4",
  region: process.env.AWS_REGION,
});

// Check file is image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new ErrorHandler("Not an image! Please upload only image", 400));
};

// Create storage using s3-multer
const multerS3Config = multerS3({
  s3: s3Config,
  bucket: "fresh-grocery-images",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    multerFilter(req, file, cb);
    const ext = file.mimetype.split("/")[1];
    file.originalname = `users-${Date.now()}.${ext}`;
    cb(null, file.originalname);
  },
});

// Upload file in s3 bucket
const upload = multer({
  storage: multerS3Config,
  // fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
  },
});

module.exports = upload;
