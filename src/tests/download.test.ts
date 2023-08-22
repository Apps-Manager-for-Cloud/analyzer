import path from 'path';
import dotenv from 'dotenv';

import { downloadRepository } from '../stages/download';

dotenv.config();

const repositoryFolder = path.join(process.cwd(), 'tmp', 'repositories');

test('Download a repo (Success)', async () => {
  const org = process.env.REPOSITORY_ORG;
  const repository = process.env.REPOSITORY;

  const result = await downloadRepository(
    org,
    repository,
    repositoryFolder,
    true,
  );
  expect(result).toMatch(new RegExp(`^.*${org}-${repository}.*$`));
});

test('Download a repo (Fail)', async () => {
  const org = process.env.REPOSITORY_ORG;
  const repository = '';

  try {
    await downloadRepository(org, repository, repositoryFolder, true);
  } catch (error) {
    expect(error.message).toMatch(/^Error downloading repository/);
  }
});
