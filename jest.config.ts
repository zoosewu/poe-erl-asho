import type {Config} from 'jest';

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/src/test/setup-env.js'],
};

export default config;