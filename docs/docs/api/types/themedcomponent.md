# ThemedComponent
[ThemedComponent]: themedcomponent
```tsx
import type { ThemedComponent } from '@dr.pogodin/react-themes';

type ThemedComponent<
  ComponentProps extends ThemeableComponentProps,
> = FunctionComponent<ThemedComponentProps<ComponentProps>>;
```
The [ThemedComponent] type describes components created by [themed()] function.
Essentially it is just a function component with props of the original component
(`ComponentProps`) extended into [ThemedComponentProps], which includes additional
optional props added by this library.

[themed()]: /docs/api/functions/themed
[ThemedComponentProps]: themedcomponentprops
