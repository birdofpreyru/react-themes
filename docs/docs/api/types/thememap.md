# ThemeMap
[ThemeMap]: thememap
```tsx
import type { ThemeMap } from '@dr.pogodin/react-themes';

interface ThemeMap {
  [key: string]: ThemeI | undefined;
}
```
[ThemeMap] interface represents a mapping from names of themed components to
their corresponding (context) themes.
