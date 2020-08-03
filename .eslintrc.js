module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'jest/valid-expect-in-promise': 'off',
    'import/extensions': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'node/no-extraneous-require': 'off',
    'import/no-cycle': 'off',
    'jest/require-tothrow-message': 'off',
    'callback-return': 'off',
    'func-style': 'off',
    'react/display-name': 'off',
    'babel/object-curly-spacing': 'off',
    // reports false positives with React's useRef hook
    'require-atomic-updates': 'off',
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    'import/order': 'off'
  },
  overrides: [
    {
      files: ['**/test/**/*.ts', '**/test/**/*.tsx', '**/tests/**/*.ts', '**/tests/**/*.tsx'],
      rules: {
        // We disable `import/no-extraneous-dependencies` for test files because it
        // would force releases of `@shopify/react-testing` (and similar devDependencies)
        // to cause unnecessary package bumps in every package that consumes them.
        // Test files with extraneous dependencies won't cause runtime errors in production.
        'import/no-extraneous-dependencies': 'off'
      }
    }
  ]
}
