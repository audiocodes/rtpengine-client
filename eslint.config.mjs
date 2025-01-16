import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPromise from 'eslint-plugin-promise';

export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  {
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    }
  }
];
