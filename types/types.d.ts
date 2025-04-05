// Inside types.d.ts

declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

  export class CloudinaryStorage implements StorageEngine {
    constructor(opts: {
      cloudinary: typeof cloudinary;
      params?: UploadApiOptions | ((req: any, file: any) => UploadApiOptions);
    });

    _handleFile(
      req: any,
      file: any,
      callback: (error: any, info?: any) => void
    ): void;

    _removeFile(req: any, file: any, callback: (error: any) => void): void;
  }
}
