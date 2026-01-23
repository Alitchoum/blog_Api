import { Injectable } from '@nestjs/common';
import { MemoryStoredFile } from 'nestjs-form-data';
import { writeFile } from 'fs/promises';

@Injectable()
export class UploadService {
  async saveImage(image: MemoryStoredFile) {
    const imgName = image.originalName;
    const path = `uploads/blogs/${imgName}`;
    await writeFile(path, image.buffer);
    return {
      imagePath: `/${path}`,
    };
  }

  async saveImages(images: MemoryStoredFile[]) {
    const imagesPaths = await Promise.all(
      images.map(async (image) => {
        const imgName = image.originalName;
        const path = `uploads/blogs/${imgName}`;

        await writeFile(path, image.buffer);

        return `/${path}`;
      }),
    );
    return imagesPaths;
  }
}
