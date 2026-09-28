import autofix from 'eslint-plugin-autofix';
import nextConfig from 'eslint-config-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';

const eslintConfig = [
  {
    ignores: ['**/next-env.d.ts', '.next/**', 'node_modules/**', 'generated/**', 'playwright-report/**'],
  },
  ...nextConfig,
  eslintConfigPrettier,
  {
    plugins: { autofix, 'sort-keys-fix': sortKeysFix },
    rules: {
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      'arrow-body-style': ['warn', 'as-needed'],
      'autofix/no-unused-vars': [
        'warn',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
          },
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              group: 'parent',
              pattern: '@/**/**',
              position: 'before',
            },
          ],
        },
      ],
      'no-console': 'warn',
      'no-redeclare': 'warn',
      quotes: ['warn', 'single', { avoidEscape: true }],
      'react/display-name': 'error',
      'react/jsx-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'spaced-comment': 'warn',
    },
  },
];

export default eslintConfig;
