# ThemedComponentProps
[ThemedComponentProps]: themedcomponentprops
```tsx
import type { ThemedComponentProps } from '@dr.pogodin/react-themes';

type ThemedComponentProps<
  ComponentProps extends ThemeableComponentProps,
> = Omit<ComponentProps, 'theme'> & {
  children?: ReactNode;
  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  mapThemeProps?: ThemePropsMapper<ComponentProps>;
  ref?: RefObject<unknown>;
  theme?: ComponentProps['theme'];
  themePriority?: PRIORITY;
};
```
The [ThemedComponentProps] generic type describes props accepted by a themed
component (_i.e._ by the component created by wrapping the original themable
component with [themed()] function).

## Generic Parameter
- `ComponentProps` extends [ThemeableComponentProps] &mdash; Props accepted by
  the original component, wrapped by [themed()] function.

## Fields
- It includes all original `ComponentProps`, which are passed to the wrapped
  original component.

**Optional**

- `children` &mdash; **ReactNode** &mdash; All themed components accept children,
  which are passed to the wrapped original component.

- `composeAdhocTheme` &mdash; [COMPOSE] &mdash; Composition mode for _ad hoc_
  theme, for this component instance (overrides default option set _via_ [themed()]).

- `composeContextTheme` &mdash; [COMPOSE] &mdash; Composition mode for _context_
  theme, for this component instance (overrides default option set _via_ [themed()]).

- `mapThemeProps` &mdash; [ThemePropsMapper]**&lt;ComponentProps&gt;** &mdash;
  Allows to customise props passed down to the wrapped component, for this component
  instance, overriding the default mapper funtion set _via_ [themed()] options
  (see `mapThemeProps` option of [ThemedOptions]).

- `ref` &mdash; **RefObject&lt;unknown&gt;** &mdash; All themed components
  accept references, which are passed down to the original wrapped component.

- `theme` &mdash; **ComponentProps['theme']** &mdash; _Ad hoc_ theme for
  the component instance. While `theme` is obligatory prop for the original
  component (see [ThemeableComponentProps]), it becomes optional for themed
  component (if not provided, the wrapped component still gets theme composed
  by the library from default and context themes).

- `themePriority` &mdash; [PRIORITY] &mdash; Theme priority mode for
  the component instance (overrides default option set _via_ [themed()]).

[COMPOSE]: /docs/api/enums/compose
[PRIORITY]: /docs/api/enums/priority
[ThemeableComponentProps]: /docs/api/types/themeablecomponentprops
[themed()]: /docs/api/functions/themed
[ThemedOptions]: themedoptions
[ThemePropsMapper]: themepropsmapper
