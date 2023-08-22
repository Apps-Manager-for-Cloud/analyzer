import fs from 'fs';
import yaml from 'js-yaml';
import { GitHubAction } from '../types/github-action';

interface GithubActionInfo {
  environment: string;
  deployment: {
    target: string;
  };
}

export default function analyzeAction(fileName: string): GithubActionInfo {
  const fileContent = fs.readFileSync(fileName, 'utf8');

  const action: GitHubAction = yaml.load(fileContent);

  const result: GithubActionInfo = {
    environment: '',
    deployment: {
      target: '',
    },
  };

  if (action.name.toLowerCase().includes('qa')) result.environment = 'qa';
  else if (action.name.toLowerCase().includes('prod'))
    result.environment = 'prod';
  else if (action.name.toLowerCase().includes('dev'))
    result.environment = 'dev';
  else result.environment = 'unknown';

  const allSteps = [];
  for (const jobName in action.jobs) {
    allSteps.push(
      ...action.jobs[jobName].steps
        .filter((step) => step.uses)
        .map((step) => step.uses),
    );
  }

  const deployToAppEngine =
    allSteps.findIndex((step) =>
      step.includes('google-github-actions/deploy-appengine'),
    ) > -1;

  const deployToCloudRun =
    allSteps.findIndex((step) =>
      step.includes('google-github-actions/deploy-cloudrun'),
    ) > -1;

  result.deployment = {
    target: deployToAppEngine
      ? 'appengine'
      : deployToCloudRun
      ? 'cloudrun'
      : 'unknown',
  };
  return result;
}
