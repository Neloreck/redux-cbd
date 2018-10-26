import * as path from "path";

module.exports = {

  clearMocks: true,

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

  coverageDirectory: "<rootDir>/target/coverage/",

  collectCoverage: true,

  coverageReporters: ["json", "html"],

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