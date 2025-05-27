# PRIORITY

```tsx
import type { PRIORITY } from '@dr.pogodin/react-themes';

enum PRIORITY {
  ADHOC_CONTEXT_DEFAULT = 'ADHOC_CONTEXT_DEFAULT',
  ADHOC_DEFAULT_CONTEXT = 'ADHOC_DEFAULT_CONTEXT',
}
```
Supported theme priority models.

- `.ADHOC_CONTEXT_DEFAULT` &mdash; In this mode _ad hoc_ theme has the highest
  priority, followed by the context, then by the default theme.
  This is the default prioty model.

- `.ADHOC_DEFAULT_CONTEXT` &mdash; In this mode _ad hoc_ theme has the highest
  priority, followed by the default theme, then by the context theme.
