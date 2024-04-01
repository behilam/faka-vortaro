module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@next/next/recommended",
    "@payloadcms",
    "prettier",
  ],
  ignorePatterns: ["**/payload-tipoj.ts", "**/payload-asertitaj-tipoj.ts"],
  plugins: ["@typescript-eslint", "react", "prettier"],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: { "{}": false },
        extendDefaults: true,
      },
    ],
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "array",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-console": "off",
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: "Unexpected property on console object was called",
      },
    ],
  },
};
