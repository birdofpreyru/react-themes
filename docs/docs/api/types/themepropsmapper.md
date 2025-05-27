# ThemePropsMapper
[ThemePropsMapper]: themepropsmapper
```tsx
import type { ThemePropsMapper } from '@dr.pogodin/react-themes';

interface ThemePropsMapper<
  ComponentProps extends ThemeableComponentProps,
> {
  (
    props: ThemedComponentProps<ComponentProps>,
    theme: ComponentProps['theme'],
  ): ComponentProps;
}
```
[ThemePropsMapper] generic interface describes a function accepted by
the `mapThemeProps` option of [themed()] function, and [ThemedComponent].

**Generic Param**
- `ComponentProps` extends [ThemeableComponentProps] &mdash; this type describes
  the own props of the themed component (_i.e._ props of the original component
  wrapped by [themed()] decorator to turn it into a themed component; and
  related [ThemedComponentProps] type describes props of that resulting
  themed component).

**Params**

- `props` &mdash; [ThemedComponentProps] &mdash; All props received by
  [ThemedComponent].
- `theme` &mdash; **ComponentProps\['theme'\]** &mdash; Composed theme.

**Returns**
- **ComponentProps** &mdash; The map of properties to pass down the original
component wrapped into [ThemedComponent].

[ThemeableComponentProps]: themeablecomponentprops
[themed()]: /docs/api/functions/themed
[ThemedComponent]: themedcomponent
[ThemedComponentProps]: themedcomponentprops
