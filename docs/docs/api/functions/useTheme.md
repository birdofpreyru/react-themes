# useTheme()
[useTheme()]: useTheme
```tsx
import { type ThemeI, useTheme } from '@dr.pogodin/react-themes';

function useTheme<ComponentTheme extends ThemeI>(
  componentName: string,
  defaultTheme?: ComponentTheme,
  adHocTheme?: ComponentTheme,
  options?: UseThemeOptionsT,
): ComponentTheme;

// Where UseThemeOptionsT is

type UseThemeOptionsT = {
  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  themePriority?: PRIORITY;

  // For backward compatibility with plain JavaScript code,
  // not intended for TypeScript use case.
  adhocTag?: 'ad.hoc';
  contextTag?: 'context';
};
```

The [useTheme()] hook composes provided _ad hoc_, default, and context themes
for the component of given name, and returns the resulting composed theme.
It replaces the old way to write themeable components using now deprecated
[themed()] function.

<details>
<summary>Migration from [themed()] to [useTheme()]</summary>

Consider this basic example of a themeable component written the old way,
using [themed()] function.
```tsx
import type { FunctionComponent, ReactNode } from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './default.module.scss';

type PropsT = {
  children?: ReactNode;
  theme: Theme<'component'>;
};

const BasicExample: FunctionComponent<PropsT>
  = ({ children, theme }) => <div className={theme.component}>{children}</div>;

export default themed(BasicExample, 'BasicExample', defaultTheme);
```

It is straightforward to rewrite it using the new [useTheme()] hook:

```tsx
import type { FunctionComponent, ReactNode } from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import defaultTheme from './default.module.scss';

type PropsT = {
  children?: ReactNode;

  // This prop now corresponds to the ad hoc theme of the themed component.
  theme?: Theme<'component'>;
};

// NOTE: In the old code BasicExample was the base component, which was wrapped
// by themed() function to become themeable; with the new approach BasicExample
// itself is the themeable component, which internally uses useTheme() hook
// to compose the ad hoc theme (if any) it gets via props, with the context
// (retrieved from the context by its name passed into the hook) and default
// themes.
const BasicExample: FunctionComponent<PropsT> = ({ children, theme }) => {
  const composed = useTheme('BasicExample', defaultTheme, theme);

  <div className={composed.component}>{children}</div>;
};

export default BasicExample;
```

If you use custom theme composition and priority props on instances of your
themed component &mdash; just add corresponding props to the component, and
pass them down the [useTheme()] hook.
</details>

## Generic Parameter
- `ComponentTheme` extends [ThemeI] &mdash; Valid theme type, use [Theme]
  generic to create one from the union of valid theme key names.

## Arguments
- `componentName` &mdash; **string** &mdash; Component name, it use used
  to retrieve the component's context theme from the parent [ThemeProvider].

- `defaultTheme` &mdash; **ComponentTheme** | **undefined** &mdash;
  Optional. Default theme for the component.

- `adHocTheme` &mdash; **ComponentTheme** | **undefined** &mdash;
  Optional. _Ad hoc_ theme for the component.

- `options` &mdash; Optional. An object with additional settings:

  - `composeAdhocTheme` &mdash; [COMPOSE] | **undefined** &mdash; Optional.
    Composition mode for the _ad hoc_ theme. Defaults `COMPOSE.DEEP`.

  - `composeContextTheme` &mdash; [COMPOSE] | **undefined** &mdash; Optional.
    Composition mode for the context theme. Defaults `COMPOSE.DEEP`.

  - `themePriority` &mdash; [PRIORITY] | **undefined** &mdash; Optional.
    Priority of context and default themes.
    Defaults `PRIORITY.ADHOC_CONTEXT_DEFAULT`.

  :::note
  The following two options are inherited from the original JavaScript
  implementation; they still work, but they do not fit well with TypeScript
  restrictions, thus, at least for now, we assume they are always set to their
  default values.

  - `.adhocTag` &mdash; `"ad.hoc"` &mdash; Overrides "ad.hoc" theme key.
    Defaults `"ad.hoc"`.

  - `.contextTag` &mdash; `"context"` &mdash; Overrides context theme key.
    Defaults `"context"`.
  :::

## Result
[useTheme()] returns **ComponentTheme** &mdash; the composed theme.

[COMPOSE]: /docs/api/enums/compose
[PRIORITY]: /docs/api/enums/priority
[themed()]: /docs/api/functions/themed
[Theme]: /docs/api/types/theme
[ThemeI]: /docs/api/types/themei
[ThemeProvider]: /docs/api/components/ThemeProvider
