import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, readdirSync, statSync } from 'fs';

@Injectable()
export class FileService {

    getFileStream(filePath: string) {
        try {
            const stats = statSync(filePath);
            const fileStream = createReadStream(filePath);
            return { stats, fileStream };
        } catch (error) {
            throw new NotFoundException(`File not found: ${filePath}`);
        }
    }

    getFilesInDirectory(directoryPath: string): string[] {
        try {
          return readdirSync(directoryPath);
        } catch (error) {
          throw new NotFoundException(`Directory not found: ${directoryPath}`);
        }
    }
}
