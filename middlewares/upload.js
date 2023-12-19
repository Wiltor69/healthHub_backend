import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { originalname } = file;
    const { _id: id } = req.auth;
    let folder;
    if (file.fieldname === "avatarURL") {
      folder = "avatars";
    } else if (file.fieldname === "documents") {
      folder = "documents";
    } else {
      folder = "misc";
    }

    const opts = {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: file.originalname,
      transformation: [
        { width: 150, height: 150 },
        { gravity: "face", crop: "thumb" },
      ],
    };

    return opts;
  },
});

const upload = multer({
  storage,
  // limits: {
  //   fileSize: 3 * 1024 * 1024,
  // },
});

export default upload;
