import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  /**
   * Next.js 推奨設定（維持する）
   */
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /**
   * 追加ルール（あなた用）
   */
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      import: importPlugin,
    },

    rules: {
      /**
       * --------------------
       * フォーマット（2space）
       * --------------------
       */
      indent: ["error", 2, { SwitchCase: 1 }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],

      /**
       * --------------------
       * import 順序
       * --------------------
       */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",

      /**
       * --------------------
       * Next / TS 実務調整
       * --------------------
       */
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }]
    },
  },

  /**
   * Storybook 推奨設定
   */
  ...storybook.configs["flat/recommended"],
];
