import path from 'path';
import dotenv from 'dotenv';

import analyzeAction from '../stages/actions';

dotenv.config();

describe('analyzeAction', () => {
  test('Test App Engine action (Prod)', async () => {
    const actionFilePath = path.join(
      process.cwd(),
      'fixtures',
      'actions',
      'action1.1.yaml',
    );

    const result = await analyzeAction(actionFilePath);
    expect(result.deployment.target).toBe('appengine');
  });

  test('Test App Engine action (QA)', async () => {
    const actionFilePath = path.join(
      process.cwd(),
      'fixtures',
      'actions',
      'action1.2.yaml',
    );

    const result = await analyzeAction(actionFilePath);
    expect(result.deployment.target).toBe('appengine');
  });

  test('Test Cloud Run Action', async () => {
    const actionFilePath = path.join(
      process.cwd(),
      'fixtures',
      'actions',
      'action2.yaml',
    );

    const result = await analyzeAction(actionFilePath);
    expect(result.deployment.target).toBe('cloudrun');
  });
});
