/**
 * @fileoverview Eslint Flat Config
 */
import js from '@eslint/js';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

const commonIgnores = ['node_modules/*', '**/dist/*'];

const configForCommon = {
  files: ['**/*.{js, ts}'],
  ignores: [...commonIgnores],
  plugins: {
    'unused-imports': eslintPluginUnusedImports,
  },
  rules: {
    /**
     * js.configs.recommended.rules: extendsが廃止になるので、rulesのみを取ってくる
     * @see {@link https://github.com/eslint/eslint/tree/main/packages/js#usage}
     */
    ...js.configs.recommended.rules,
    'object-shorthand': ['error', 'properties'],
    'unused-imports/no-unused-imports': 'error',
  },
};

const configForTypeScript = {
  files: ['**/*.ts'],
  ignores: [...commonIgnores],
  languageOptions: {
    parser: typescriptEslintParser,
    parserOptions: {
      project: ['tsconfig.json'],
    },
  },
  plugins: {
    /** { key: plugin } の key名は、後続のrulesで { key: 'level' }に該当する */
    '@typescript-eslint': typescriptEslintPlugin,
  },
  rules: {
    /**
     * @see {@link https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/src/configs}
     */
    ...typescriptEslintPlugin.configs.recommended.rules,
    /**
     * configからrulesだけ抜き出すwork around
     * @see {@link https://zenn.dev/babel/articles/eslint-flat-config-for-babel#%E3%83%97%E3%83%A9%E3%82%B0%E3%82%A4%E3%83%B3%E9%87%8D%E8%A4%87%E7%99%BB%E9%8C%B2%E3%81%AE%E7%BD%A0}
     */
    ...typescriptEslintPlugin.configs['eslint-recommended'].overrides[0].rules,
    '@typescript-eslint/no-unused-vars': 'off',
  },
};

/** 最終的に上書きしたい設定を、配列の一番最後にする */
const lastModifiedConfigs = {
  /**
   * eslintPluginPrettierRecommended: eslint上でprettierを動かす
   * @see {@link https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs}
   */
  ...eslintPluginPrettierRecommended,
  /**
   * eslintConfigPrettier: prettierと衝突するeslintのrulesの無効化
   * @see {@link https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#eslintconfigjs-flat-config-plugin-caveat}
   */
  ...eslintConfigPrettier,
  /**
   * @see {@link https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#options}
   */
  // rules: {
  //   'prettier/prettier': [
  //     'error',
  //     {
  //       singleQuote: true,
  //       semi: true,
  //     },
  //   ],
  // },
};

/**
 * 最終的には配列の全ての設定を読み込むことになる。
 * 配列間で重複するconfig,rulesなどは、配列の後方にあるもので最終的に設定される。
 */
export default [configForCommon, configForTypeScript, lastModifiedConfigs];
