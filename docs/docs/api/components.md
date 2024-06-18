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
- `composeAdhocTheme` - **string** - Allows to override composition mode of
  _ad hoc_ theme, specified via [themed()]. Must be one of [COMPOSE] values.

- `composeContextTheme` - **string** - Allows to override composition mode of
  context theme, specified via [themed()]. Must be one of [COMPOSE] values.

- `theme` - **object** - _Ad hoc_ theme to apply to the component instance.

- `themePriority` - **string** - Allows to override theme priorities,
  specified via [themed()]. It must be one of [PRIORITY] values.

- `mapThemeProps` - **[ThemePropsMapper]** - Allows to verride the props mapper
  specified via [themed()].

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

[COMPOSE]: constants#compose
[PRIORITY]: constants#priority
[themed()]: functions#themed
[ThemedComponent]: #themedcomponent
[ThemePropsMapper]: functions#themepropsmapper
[ThemeProvider]: #themeprovider
