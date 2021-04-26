const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// CONFIGS FOR CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// CONFIGURATIONS FOR CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rooms-folder", // folder name on cloudinary
    resource_type: "image", // what type of resource
    allowed_formats: ["jpg", "png"], // allowed formats of files
    use_filename: true, // Give the file a name to refer to when uploading to cloudinary
    // transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// MULTER IS NEEDED TO CONNECT TO CLOUDINARY + WE WILL USE IT ON THE ROUTES
module.exports = multer({ storage });
