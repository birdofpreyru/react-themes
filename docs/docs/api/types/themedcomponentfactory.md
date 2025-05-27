# ThemedComponentFactory
[ThemedComponentFactory]: themedcomponentfactory

```tsx
import type { ThemedComponentFactory } from '@dr.pogodin/react-themes';

type ThemedComponentFactory<
  ComponentProps extends ThemeableComponentProps> = (
    component: ComponentType<ComponentProps>,
  ) => ThemedComponent<ComponentProps>;
```

The [ThemedComponentFactory] type is the return type of [themed()] function in
its &laquo;decorator&raquo; signature variant.

[themed()]: /docs/api/functions/themed
