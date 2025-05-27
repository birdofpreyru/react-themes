# ThemeProvider
[ThemeProvider]: themeprovider
```tsx
import { ThemeProvider } from '@dr.pogodin/react-themes';

const ThemeProvider: FunctionComponent<ThemeProviderProps>;
```
The [ThemeProvider] component defines style contexts. It accepts a single object
property `themes` that gives the mapping between themed component names and context
themes that should be applied to them within [ThemeProvider] children tree.
The content wrapped by [ThemeProvider] tags is rendered in-place of that component.

In case of nested context, the context theme from the closest context takes
the effect on a component. If the context theme for a component is not set in
the closest context, but it is set in an outer context, the theme from outer
context will be applied.

## Properties
```tsx
import type { ThemeProviderProps } from '@dr.pogodin/react-themes';

type ThemeProviderProps = {
  children?: ReactNode;
  themes?: ThemeMap;
};
```

- `themes` &mdash; [ThemeMap] &mdash; The mapping between themed component names
  (the first parameter passed into [themed()] upon the component registration),
  and context themes (_i.e._ objects created for imported SCSS themes by
  CSS module setup) to apply to them within the context.

- `children` &mdash; **ReactNode** &mdash; The content to render in-place of [ThemeProvider].

[themed()]: /docs/api/functions/themed
[ThemeMap]: /docs/api/types/thememap
