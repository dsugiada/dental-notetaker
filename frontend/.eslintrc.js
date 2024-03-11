module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      'react',
      'react-hooks',
    ],
    rules: {
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
      // other rules...
    },
    overrides: [
      {
        "files": ["**/*.spec.ts", "**/*.spec.tsx"],
        "env": {
            "jest": true
        }
      },
      {
        "files": ["cypress/**/*.ts"],
        "env": {
            "cypress/globals": true
        },
        "extends": ["plugin:cypress/recommended"],
        "plugins": ["cypress"]
      }
    ]
  };
  