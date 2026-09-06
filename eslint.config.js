import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // These files intentionally co-export helpers/constants alongside a component
    // (shadcn/ui primitives with cva variants, schema.org builders, icon maps).
    // The rule only affects dev-time Fast Refresh, not production output.
    files: [
      "src/components/ui/**/*.{ts,tsx}",
      "src/components/SEO/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      // data arrays exported for schema.org ItemList/Event builders in src/pages
      "src/components/{Talks,Awards,Certificates,Certifications,Recommendations}.tsx",
      "src/routes.tsx",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
