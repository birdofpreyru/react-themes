---
sidebar_position: 3
---

# Functions

## setCompatibilityMode()

```jsx
export function setCompatibilityMode(mode)
```

Switches React Themes library into a compatibility mode, in which it emulates
behavior of different similar theming libraries.

| Param | Type | Description |
| - | - | - |
| `mode` | `string` | Compatibility mode, one of [COMPATIBILITY_MODE](constants#compatibility_mode) values |

## themed()()

```jsx
export default themed(
  componentName,
  themeSchema,
  defaultTheme,
  options,
)(BaseComponent): ThemedComponent
```
Registers a themed component under given name, and with an optional default
theme.

The second argument (`themeSchema`) can be omitted, thus you can threat this
function as `themed(componentName, defaultTheme, options)` as well. The library
distinguish these two variants by the type of second argument: if an array,
the form with `themeSchema` is assumed; otherwise the second variant with three
arguments (two of which are optional). The first syntax is recommended,
while the second one is implemented mostly for compatibility with older
similar libraries.

`themed()` can be used as a decorator, or in the following (recommended) way:
```jsx
import themed from '@dr.pogodin/react-themes';
import defaultTheme from './default.scss';

function Component() { ... }

export default themed('ThemedComponent', [...], defaultTheme)(Component);
```

When rendered, your component will receive the composed theme via its
`theme` prop. You will just need to pass the values from `theme` into
the `className` attributes of your component elements, as shown in
the [Getting Started](/docs/tutorial/getting-started#basic-themed-component)
tutorial.

| Param | Type | Description |
| - | - | - |
| `componentName` | `string` | **Required**. Themed component name, which should be used to provide its context theme via [`<ThemeProvider>`](components#ThemeProvider). |
| `defaultTheme` | `object` | Default theme, in form of theme key to CSS class name mapping. If you have CSS modules and SCSS loader correctly configured, the import `import theme from 'some.theme.scss'` will result in `theme` object you can pass here. In some cases, it might be also legit to construct theme object in a diffent way. |
| `themeSchema` | `string[]` | An array of valid theme keys recognized by the wrapped component, beside the keys corresponding to _ad hoc_ and context tags. It is used for theme validation, and casting (if opted). See `themeType` and `castTheme` in [`<ThemeableComponent>`](components#ThemeableComponent) documentation. |
| `options` | `object` | [Additional options](#themed-options) |

#### Options {#themed-options}

| Option | Type | Description |
| - | - | - |
| `adhocTag` | `string` | Overrides "ad.hoc" theme key. Defaults "`ad.hoc`". |
| `composeAdhocTheme` | `string` | Composition type for _ad hoc_ theme, which is merged into the result of composition of lower priority themes. Must be one of [COMPOSE](constants#compose) values. Defaults `COMPOSE.DEEP`. |
| `composeContextTheme` | `string` | Composition type for context theme into default theme (or vice verca, if opted by `themePriority` override). Must be one of [COMPOSE](constants#compose) values. Defaults `COMPOSE.DEEP`. |
| `contextTag` | `string` | Overrides "context" theme key. Defaults "`context`". |
| `mapThemeProps` | [`ThemePropsMapper`](#ThemePropsMapper) | By default, a themed component created by `themed()` does not pass into the original wrapped component any properties introduced by this library. It only passes down properties it does not recognize, alongside the composed `theme`, and forwarded DOM `ref`. In case a different behavior is needed, the property mapper can be specified with this option. It should be a function with [`ThemePropsMapper`](#ThemePropsMapper) signature, and if present the result from this function will be passed down the wrapped component as its props. |
| `themePriority` | `string` | Theme priorities. Must be one of [PRIORITY](constants#priority) values. Defaults `PRIORITY.ADHOC_CONTEXT_DEFAULT`. |
| `composeTheme` | `string` | **Deprecated**. Compatibility compose mode. |
| `mapThemrProps` | `function` | **Deprecated**. Compatibility prop mapper. |

See [`<ThemedComponent>`](components#ThemedComponent) for the description of
themed components created by `themed()()` calls.

## ThemePropsMapper

```jsx
function themePropsMapper(props, theme): object
```
Function signature accepted by `mapThemeProps` option of [themed()()](#themed)
decorator.

| Params | Type | Description |
| - | - | - |
| `props` | `object` | All props received by [`<ThemedComponent>`](components#ThemedComponent). |
| `theme` | `object` | Composed theme. |

**Returns** `object` &rArr; The map of properties to pass down the original
component wrapped into [`<ThemedComponent>`](components#ThemedComponent).

