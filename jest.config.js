// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  // Next's SWC transformer rewrites `@/` in imports but not in jest.mock()
  // specifiers, so the alias needs an explicit mapping.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/e2e"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
};
const asyncConfig = createJestConfig(config);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [];

  return config;
};
