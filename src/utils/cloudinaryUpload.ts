import cloudinary from "../config/cloudinary";

export function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(file.buffer);
  });
}