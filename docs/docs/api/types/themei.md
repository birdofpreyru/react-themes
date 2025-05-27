# ThemeI
[ThemeI]: themei
```tsx
import type { ThemeI } from '@dr.pogodin/react-themes';

interface ThemeI {
  ad: string;
  hoc: string;
  context: string;
}
```
[ThemeI] interface describes keys obligatory for each theme, as they are
instrumental for the core library mechanics (for enforcing styles priority).
Generic [Theme] type implements this interface, and most probably you want
to use [Theme] to define your custom theme types, rather than using [ThemeI]
interface directly.

:::note
In theory, JavaScript build of the library still allows to opt for different
names of these base keys, and extending this interface it should be possible
to support that on TypeScript side; however, it seems a low-value and quite
cumbersome feature, thus for now we gonna assume that these key names are
hard-fixed, unless there is a very good reason to fully support again custom
names for these keys in future.
:::

[theme]: theme
