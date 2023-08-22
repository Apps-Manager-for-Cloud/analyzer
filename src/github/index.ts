import { createTokenAuth } from '@octokit/auth-token';
import { Octokit } from 'octokit';
import fetch from 'node-fetch';

class GithubHelper {
  async buildClient() {
    if (!process.env.GITHUB_TOKEN)
      throw new Error('Missing GITHUB_TOKEN on environment');
    const auth = createTokenAuth(process.env.GITHUB_TOKEN);
    const { token } = await auth();

    const octokit = new Octokit({
      auth: token,
      request: {
        fetch: fetch,
      },
    });
    return octokit;
  }
}

export default new GithubHelper();
