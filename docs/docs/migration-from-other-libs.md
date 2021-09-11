---
sidebar_position: 3
---

# Migration from Other Libs

There are very similar older libraries out there:
- [react-css-themr](https://www.npmjs.com/package/react-css-themr) &ndash;
the original inspiration for this work
- [react-css-super-themr](https://www.npmjs.com/package/react-css-super-themr) &ndash;
  an earlier attempt to maintain and enhance `react-css-themr`, which
  was not maintained by its original author for quite some time, before getting
  new maintainers recently.


{@link setCompatibilityMode} function feature allows `react-themes`
to closely emulate behavior of those older libs (you will still have to
upgrade your code to use the latest React 16+). For a complete migration to this
library, you will need to patch your code to address the following points:

## `react-css-themr`

These are the differences of React Themes library compared to `react-css-themr`:

- Composition mode values are changed from `"deeply"`, `"softly"`, and `false`
  to `"DEEP"`, `"SOFT"`, and `"SWAP"`.

- Default theme priority is `ADHOC_CONTEXT_DEFAULT` instead of
  `ADHOC_DEFAULT_CONTEXT`, also the actual priority mode values have changed
  from `adhoc-context-default`, and `adhoc-default-context`.

- `mapThemrProps` option of themed component decorator is replaced by
  `mapThemeProps`.

- `composeTheme` option of themed component decorator is replaced by two
  separate options: `composeAdhocTheme`, and `composeContextTheme`.

- Themes require specifity wrappers (however, any theming that used to work
  fine without them, should keep on working fine, although correct deep theme
  merging won't work in complex scenarios).

## `react-css-super-themr`

- Composition mode values are changed from `"deeply"`, `"softly"`, and `false`
  to `"DEEP"`, `"SOFT"`, and `"SWAP"`.

- Default theme priority is `ADHOC_CONTEXT_DEFAULT` instead of
  `ADHOC_DEFAULT_CONTEXT`, also the actual priority mode values have changed
  from `adhoc-context-default`, and `adhoc-default-context`.

- `mapThemrProps` option of themed component decorator is replaced by
  `mapThemeProps`.

- Themes require specifity wrappers (however, any theming that used to work
  fine without them, should keep on working fine, although correct deep theme
  merging won't work in complex scenarios).
