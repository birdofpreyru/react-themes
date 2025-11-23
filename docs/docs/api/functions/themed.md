---
sidebar_class_name: deprecated
---

# themed()
[themed()]: themed

:::danger Deprecated
The [themed()] function, and the old way to implement themeable components are
deprecated in favour of the new [useTheme()] hook in the library version **v1.10.0**.
For now, [themed()] still works, but it will be removed in future library versions.
For migration instructions see [useTheme()] documentation.
:::

## Original Documentation
```tsx
import themed from '@dr.pogodin/react-themes';

// Recommended signature:
function themed<ComponentProps extends ThemeableComponentProps>(
  component: ComponentType<ComponentProps>,
  componentName: string,
  defaultTheme: ComponentProps['theme'],
  options?: ThemedOptions<ComponentProps>,
): ThemedComponent<ComponentProps>;
```

<details>
<summary>Full & decorator signatures of [themed()]</summary>

The full signature of [themed()] function is the following
(essentially, it allows to skip `defaultTheme` argument altogether, and
to provide `options` in its position). It is provided mostly for backward
compatibility, as in practice `defaultTheme` argument is always used.
```tsx
function themed<ComponentProps extends ThemeableComponentProps>(
  component: ComponentType<ComponentProps>,
  componentName: string,

  defaultThemeOrOptions?: ComponentProps['theme']
    | ThemedOptions<ComponentProps>,

  options?: ThemedOptions<ComponentProps>,
): ThemedComponent<ComponentProps>;
```
Also for backward compatibility, this variant of [themed()] function exists,
and allows to use it as a (legacy?) decorator. It is not recommended,
as [Decorators](https://github.com/tc39/proposal-decorators) in JavaScript
have a difficult history, with different variants implemented by different
tools ([Babel](https://babeljs.io/docs/babel-plugin-proposal-decorators)),
and language flavours
([TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html))
at different times, and because decorators do not provide any unqiue
possibilities that can't be achived without them. If ever they finally become
a standard part of JS/TS eco-system, most probably their support by this library
will have to be revised.
```tsx
function themed<ComponentProps extends ThemeableComponentProps>(
  componentName: string,

  defaultThemeOrOptions?: ComponentProps['theme']
    | ThemedOptions<ComponentProps>,

  options?: ThemedOptions<ComponentProps>,
): ThemedComponentFactory<ComponentProps>;
```
</details>


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

## Generic Parameter
- `ComponentProps` extends [ThemeableComponentProps] &mdash; this type describes
  the props accepted by the original component, wrapped by [themed()] function.

## Arguments
- `component` &mdash; **ComponentType\[ComponentProps\]** &mdash; The base
  component to be themed, its props must compty with the [ThemeableComponentProps]
  interface.

- `componentName` &mdash; **string** &mdash; Themed component name, which should
  be used to provide its context theme via [ThemeProvider].

- `defaultTheme` &mdash; **ComponentProps\['theme'\]** &mdash; Default theme,
  in the form of theme key to CSS classname mapping.

**Optional**

- `options` &mdash; [ThemedOptions] &mdash; Additional options accepted by
  the function.

## Returns

The recommended signature of this function returns themed component:
- [ThemedComponent]**\<ComponentProps\>**

The decorator variant returns instead the component factory, which should be
called right away with a single argument &mdash; the base component to wrap:
- [ThemedComponentFactory]**\<ComponentProps\>**

[ThemeableComponentProps]: /docs/api/types/themeablecomponentprops
[ThemedComponent]: /docs/api/types/themedcomponent
[ThemedComponentFactory]: /docs/api/types/themedcomponentfactory
[ThemedOptions]: /docs/api/types/themedoptions
[ThemeProvider]: /docs/api/components/themeprovider
[useTheme()]: /docs/api/functions/useTheme
