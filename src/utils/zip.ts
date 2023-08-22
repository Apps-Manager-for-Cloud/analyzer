import unzipper from 'unzipper';
import fs from 'fs';

export function extractZip(zipFilePath: string, destinationDir: string) {
  return new Promise<string | object>((resolve, reject) => {
    const extractStream = fs
      .createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: destinationDir }));

    extractStream.on('finish', () => {
      fs.rmSync(zipFilePath);
      resolve(destinationDir);
    });

    extractStream.on('error', (err) => {
      reject(err);
    });
  });
}
