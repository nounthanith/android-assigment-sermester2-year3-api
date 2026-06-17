import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: Buffer,
  folder: string = "uploads"
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      })
      .end(file);
  });
}

export async function deleteImage(url: string): Promise<void> {
  // extract public_id from url
  const parts = url.split("/");
  const filename = parts[parts.length - 1].split(".")[0];
  const folder = parts[parts.length - 2];
  const publicId = `${folder}/${filename}`;
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;