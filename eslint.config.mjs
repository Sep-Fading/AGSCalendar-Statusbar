import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser, // Useful for some DOM-like types
                ...globals.node,
                print: "readonly", // GJS specific
                pkg: "readonly", // GJS specific
                log: "readonly", // GJS specific
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "off", // Often needed for Gtk signals
            "no-undef": "off", // TypeScript handles this better
        },
    },
)
