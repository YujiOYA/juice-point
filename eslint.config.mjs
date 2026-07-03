import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
    {
        ignores: ["storybook-static/**", ".claude/**"],
    },

    /**
     * Next.js 推奨設定（維持する）
     * eslint-config-next v16 はネイティブ flat config（import プラグインも登録済み）
     */
    ...nextCoreWebVitals,
    ...nextTypescript,

    /**
     * 追加ルール（あなた用）
     */
    {
        files: ["**/*.{js,jsx,ts,tsx}"],

        rules: {
            /**
             * --------------------
             * フォーマット（4space）
             * --------------------
             */
            indent: ["error", 4, { SwitchCase: 1 }],
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
            "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
        },
    },

    /**
     * Storybook 推奨設定
     */
    ...storybook.configs["flat/recommended"],
]);
