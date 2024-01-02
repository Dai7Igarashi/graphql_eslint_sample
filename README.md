# graphql eslint sample

```console
$ npm install --save-dev lerna typescript npm-run-all2
$ npx lerna init --packages="packages/*" --independent
```

https://eslint.org/docs/latest/use/configure/plugins#include-a-plugin

```
@dai7igarashi/eslint-plugin-graphql
@dai7igarashi/eslint-plugin-react
@dai7igarashi/eslint-plugin-a11y
```

```js
// .eslintrc.js
{
  plugins: [
    "@dai7igarashi/graphql", // means @dai7igarashi/eslint-plugin-graphql
  ],
  rules: {
    "@dai7igarashi/graphql/my-rule": "error",
  },
}
```

https://eslint.org/docs/latest/extend/plugins#linting

ディレクトリ構成

```
packages
┗
```

workspace 全体の設定

```
npm install --save-dev eslint
```

workspace 個別

```
npm install -w packages/hoge --save-dev node-fetch
```
