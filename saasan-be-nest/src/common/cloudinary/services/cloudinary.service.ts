import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.SAASAN_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.SAASAN_CLOUDINARY_API_KEY,
      api_secret: process.env.SAASAN_CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'report-evidences',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            folder,
            public_id: `${Date.now()}-${file.originalname}`,
            quality: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
