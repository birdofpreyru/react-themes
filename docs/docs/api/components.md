---
sidebar_position: 4
---

# Components

## ThemedComponent

```jsx
const ThemedComponent = themed('Name', [
  'sampleThemeKey1',
  'sampleThemeKey2',
], defaultTheme)(BaseComponent)
```

This section documents additional features of any themed component created by
[themed()] registration call.

Instances of any [ThemedComponent] pass down the base component any props
beside the following ones, which allow to override for given component instance
theming settings configured upon the registration with [themed()].

**Props**

- `castTheme` - **boolean** - If **true**, the component will rely on
  `themeSchema` provided to [themed()] function upon the component registration,
  to pick up from _ad hoc_ theme and pass down only expected theme key/values.

- `composeAdhocTheme` - **string** - Allows to override composition mode of
  _ad hoc_ theme, specified via [themed()]. Must be one of [COMPOSE] values.

- `composeContextTheme` - **string** - Allows to override composition mode of
  context theme, specified via [themed()]. Must be one of [COMPOSE] values.

- `theme` - **object** - _Ad hoc_ theme to apply to the component instance.

- `themePriority` - **string** - Allows to override theme priorities,
  specified via [themed()]. It must be one of [PRIORITY] values.

- `mapThemeProps` - **[ThemePropsMapper]** - Allows to verride the props mapper
  specified via [themed()].

### `theme` typecheck

If `themeSchema` was provided to [themed()], the component
function will have `.themeType` field (function) attached, which can be passed
into React's `.propTypes` to check _ad hoc_ theme passed into the component
(without `themeSchema` provided, it will expect empty `theme`).

Here is an example of `theme` prop check:
```jsx
import themed from '@dr.pogodin/react-themes';

function Component({ theme }) {
  return <div className={theme.container} />;
}

const ThemedComponent = themed('Component', [
  'container',
])(Component);

Component.propTypes = {
  theme: ThemedComponent.themeType.isRequired,
};

export default ThemedComponent;
```

This will warn you if theme is missing, contains unexpected fields,
or misses _ad hoc_, or context tag keys. In the case of _ad hoc_ styling you
may want to not have a dedicated stylesheet for the _ad hoc_ theme, and it
will be seen as an issue by this check. In such case the
`castTheme` option comes handly.


## ThemeProvider

```jsx
export function ThemeProvider(props)
```

[ThemeProvider] defines style contexts. It accepts a single object property
`themes` that gives the mapping between themed component names and context themes
that should be applied to them within [ThemeProvider] children tree. The content
wrapped by [ThemeProvider] tags is rendered in-place of that component.

In case of nested context, the context theme from the closest context takes
the effect on a component. If the context theme for a component is not set in
the closest context, but it is set in an outer context, the theme from outer
context will be applied.

**Props**

- `themes` - **object** - The mapping between themed component names (the first
  parameter passed into [themed()] upon the component registration), and context
  themes (_i.e._ objects created for imported SCSS themes by CSS module setup)
  to apply to them within the context.

- `children` - **ReactNode** - The content to render in-place of [ThemeProvider].

- **Deprecated** `theme` - **object** - The fallback value to use if `themes`
  prop is missing. It is for backward compatibility with `react-css-themr`
  and `react-css-super-themr` libraries.

[COMPOSE]: constants#compose
[PRIORITY]: constants#priority
[themed()]: functions#themed
[ThemedComponent]: #themedcomponent
[ThemePropsMapper]: functions#themepropsmapper
[ThemeProvider]: #themeprovider
