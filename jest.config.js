module.exports = {
  rootDir: "./",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)spec)\\.ts$",
  modulePathIgnorePatterns: [
    "<rootDir>/build/"
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ]
}
