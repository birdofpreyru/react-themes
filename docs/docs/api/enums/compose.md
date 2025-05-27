# COMPOSE

```tsx
import { COMPOSE } from '@dr.pogodin/react-themes';

enum COMPOSE {
  DEEP = 'DEEP',
  SOFT = 'SOFT',
  SWAP = 'SWAP',
}
```
Supported theme composition modes. Two component themes with lower (`L`),
and higher (`H`) priorities can be merged in the following ways:

- `.DEEP` &mdash; In deep composition mode all classes from `H` are applied with
  higher specifity, on top of all classes from `L`, which are applied with lower
  specifity. Thus, in case of conflicting rules, theme `H` overrides `L`,
  but otherwise rules from `L` are used as defaults. It is the default
  composition mode.

- `.SOFT` &mdash; In soft composition mode all classes from `H` are applied, while
  classes from theme `L` are applied only if they are absent in theme `H`.
  Thus, any classes defined in `H` completely override corresponding classes
  from `L`.

- `.SWAP` &mdash; In swap mode only classes from theme `H`  are applied,
  thus theme `H` completely overrides `L`.
