---
sidebar_position: 3
---

# Functions

## themed()

```tsx
import themed from '@dr.pogodin/react-themes';

// Recommended signature:
function themed(
  BaseComponent: React.ComponentType,
  componentName: string,
  defaultTheme?: Theme,
  options?: Options,
): ThemedComponent;

// Decorator signature:
function themed(
  componentName: string,
  defaultTheme?: Theme,
  options?: Options,
): (BaseComponent: React.ComponentType) => ThemedComponent
```
Registers a themed component under the given name, and with an optional default
theme.

[themed()] can be used as a decorator, or in the following (recommended) way:
```jsx
import themed from '@dr.pogodin/react-themes';
import defaultTheme from './default.scss';

function Component() { ... }

export themed(Component, 'ThemedComponent', defaultTheme);
```

When rendered, your component will receive the composed theme via its
`theme` prop. You will just need to pass the values from `theme` into
the `className` attributes of your component elements, as shown in
the [Getting Started](/docs/tutorial/getting-started#basic-themed-component)
tutorial.

**Params**

- `componentName` - **string** - Themed component name, which should be used
  to provide its context theme via [ThemeProvider].

- `defaultTheme` - **object** - Optional. Default theme, in the form of theme
  key to CSS classname mapping.

- `options` - **object** - Optional. Additional settings.

  - `.adhocTag` - **string** - Overrides "ad.hoc" theme key. Defaults `"ad.hoc"`.

  - `.composeAdhocTheme` - **string** - Composition type for _ad hoc_ theme,
    which is merged into the result of composition of lower priority themes.
    Must be one of [COMPOSE] values. Defaults `COMPOSE.DEEP`.

  - `.composeContextTheme` - **string** - Composition type for context theme
    into default theme (or vice verca, if opted by `themePriority` override).
    Must be one of [COMPOSE] values. Defaults `COMPOSE.DEEP`.

  - `.contextTag` - **string** - Overrides context theme key. Defaults `"context"`.

  - `.mapThemeProps` - **[ThemePropsMapper]** - By default, a themed component
    created by [themed()] does not pass into the original base component any
    props introduced by this library. A function provided by this option will
    get the composed theme and all properties, and the result from this function
    call will be passed as props down the base component.

  - `.themePriority` - **string** - Theme priorities. Must be one of [PRIORITY]
    values. Defaults `PRIORITY.ADHOC_CONTEXT_DEFAULT`.

**Returns**

- **function (BaseComponent): [ThemedComponent]**
  
  The result of [themed()]
  call is a wrapper function, which should be called right away with a single
  argument, the base component to wrap. Such syntax makes it possible (although
  not recommendable) to use it as a decorator. The final result will be a newly
  created [ThemedComponent] which works the same as the given `BaseComponent`
  beside having a few extra features, as per its documentation.

## ThemePropsMapper

```jsx
function themePropsMapper(props, theme): object
```
Function signature accepted by `mapThemeProps` option of [themed()] decorator
and [ThemedComponent] .

**Params**

- `props` - **object** - All props received by [ThemedComponent].
- `theme` - **object** - Composed theme.

**Returns**
- **object** - The map of properties to pass down the original
component wrapped into [ThemedComponent].

[COMPOSE]: constants#compose
[PRIORITY]: constants#priority
[themed()]: #themed
[ThemedComponent]: components#themedcomponent
[ThemeProvider]: components#themeprovider
[ThemePropsMapper]: #themepropsmapper
