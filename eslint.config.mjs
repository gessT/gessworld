import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

const compat = new FlatCompat();

const eslintConfig = [
  js.configs.recommended,
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
];

export default eslintConfig;
