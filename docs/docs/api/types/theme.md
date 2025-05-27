# Theme
[Theme]: theme
```tsx
import type { Theme } from '@dr.pogodin/react-themes';

type Theme<KeyT extends string>
  = string extends KeyT ? never : ThemeI & Partial<Record<KeyT, string>>;
```

[Theme] generic type helps to define custom theme types. You call it with
a union of string literals representing valid keys for your theme; _e.g._ if
your theme has two valid keys, `"container"` and `"content"` (corresponding to
`.container` and `.content` class names in SCSS code) you should define your
theme type as

```ts
type MyTheme = Theme<'container' | 'content'>;

// the result will be equivalent to:

type MyTheme = {
  // These fields are provided by the base "ThemeI" interface:
  ad: string;
  hoc: string;
  context: string;

  // These come from the string literal union you provided:
  container?: string;
  content?: string;
};
```

As mentioned in the example, [ThemeI] interface includes into the result
obligatory key names `ad`, `hoc`, `context`. Also [Theme] generic has
a safeguard turning the result into `never` if given argument, by mistake,
evaluates the general `string` type.

[ThemeI]: themei
