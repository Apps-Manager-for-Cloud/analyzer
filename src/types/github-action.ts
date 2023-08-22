export interface GitHubAction {
  name: string;
  on: {
    [eventName: string]: any;
  };
  jobs: {
    [jobName: string]: {
      name: string;
      runsOn: string;
      steps: Array<{
        name: string;
        id?: string;
        uses?: string;
        run?: string;
        with?: {
          [key: string]: string;
        };
        env?: {
          [key: string]: string;
        };
        continueOnError?: boolean;
      }>;
      // Add more properties if needed
    };
  };
  // Add more properties if needed
}
