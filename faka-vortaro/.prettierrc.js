/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 100,
  parser: "typescript",
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  arrowParens: "avoid",
  overrides: [
    {
      files: ["**/*[Tt](ypes|ipoj|ipojn).ts"],
      options: {
        printWidth: 140,
      },
    },
  ],
};
