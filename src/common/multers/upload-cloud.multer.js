import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "congkti",
  api_key: "285936293236631",
  api_secret: "2DZ4n77_Tx2o4Y3MLUcngJmr5xY", // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
  },
});

const uploadCloud = multer({ storage: storage });

export default uploadCloud;
