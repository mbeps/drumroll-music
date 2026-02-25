import nextConfig from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: ["coverage/**", ".next/**", "node_modules/**"],
  },
  ...nextConfig,
];

export default eslintConfig;
