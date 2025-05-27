# ThemeableComponentProps
[ThemeableComponentProps]: themeablecomponentprops
```tsx
import type { ThemeableComponentProps } from '@dr.pogodin/react-themes';

interface ThemeableComponentProps {
  theme: ThemeI;
}
```
[ThemeableComponentProps] interface should be complied by a component props
to make the component eligible to be themed by [themed()] function. Essentially,
to be themeable a component should accept `theme` prop, which in turn should
comply with [ThemeI] interface (but in practice it should be typed with its
custom theme type, defined using [Theme] generic type).

[themed()]: /docs/api/functions/themed
[theme]: theme
[ThemeI]: themei
