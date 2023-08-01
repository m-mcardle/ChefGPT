import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build-test && npm run preview-test',
		port: 4173
	},
	testDir: 'tests',
};

export default config;
