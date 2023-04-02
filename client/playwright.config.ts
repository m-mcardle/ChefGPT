import type { PlaywrightTestConfig } from '@playwright/test';
// import { devices } from '@playwright/test';

// For: https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
  // projects: [
  //   { name: 'setup', testMatch: /.*\.setup\.ts/ },
  //   {
  //     name: 'chromium',
  //     use: {
  //       ...devices['Desktop Chrome'],
  //       // Use prepared auth state.
  //       storageState: 'playwright/.auth/user.json',
  //     },
  //     dependencies: ['setup'],
  //   },
  //   {
  //     name: 'firefox',
  //     use: {
  //       ...devices['Desktop Firefox'],
  //       // Use prepared auth state.
  //       storageState: 'playwright/.auth/user.json',
  //     },
  //     dependencies: ['setup'],
  //   },
  // ],
};

export default config;
