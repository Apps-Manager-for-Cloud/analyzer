import fs from 'fs';
import path from 'path';
import GithubHelper from '../github';
import { parse as parseContentDisposition } from '../utils/content-disposition';
import { extractZip } from '../utils/zip';

/**
 * Download a Github repository as a zip file and extract it to a folder
 * @param organization
 * @param repo
 * @param destinationFolder
 * @param deleteZipAfter Delete the zip file after extracting it
 * @returns The path to the extracted folder
 */
export async function downloadRepository(
  organization: string,
  repo: string,
  destinationFolder: string,
  deleteZipAfter = false,
) {
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  const client = await GithubHelper.buildClient();
  let response;
  try {
    response = await client.request(
      `GET /repos/${organization}/${repo}/zipball`,
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  } catch (error) {
    throw new Error(`Error downloading repository: ${error.message}`);
  }

  const zipFileName = parseContentDisposition(
    response.headers['content-disposition'],
  ).filename;

  const zipFilePath = path.join(destinationFolder, zipFileName);

  const zipData = Buffer.from(response.data);

  fs.writeFileSync(zipFilePath, zipData);

  const unzippedFolder = path.join(
    destinationFolder,
    path.parse(zipFileName).name,
  );

  if (!fs.existsSync(unzippedFolder)) {
    fs.mkdirSync(unzippedFolder);
  }

  await extractZip(zipFilePath, destinationFolder);

  if (deleteZipAfter) fs.rmSync(zipFilePath, { force: true });

  return path.join(destinationFolder, path.parse(zipFileName).name);
}
