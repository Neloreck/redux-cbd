import * as path from "path";

module.exports = {

  clearMocks: true,

  coverageDirectory: path.resolve("test/coverage"),

  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],

  moduleNameMapper: {
  },

  rootDir: path.resolve(__dirname, "../"),

  roots: [
    "<rootDir>"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  testRegex: "(/__tests__/.*|(\\.|/)(test|Spec))\\.tsx?$",

  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },

  transformIgnorePatterns: [
    "/node_modules/"
  ],

  verbose: true,

  globals: {
    "ts-jest": {
      tsConfigFile: "<rootDir>/src/tsconfig.json",
      useBabelrc: true
    }
  }
};