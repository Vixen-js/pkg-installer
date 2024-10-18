/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  verbose: true,
  testMatch: ["**/*.test.ts"],
  testEnvironment: "node",
  transform: {
    "^.test.tsx?$": "ts-jest",
  },
};
