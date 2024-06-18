import { type Theme } from '../src';

export type ComponentTheme = Theme<'container' | 'content'>;

export type ComponentProps = {
  children?: React.ReactNode;
  theme: ComponentTheme;
  goodKey?: string;
};

export default function Component({
  children,
  goodKey = '',
  theme,
}: ComponentProps) {
  return (
    <div className={theme.container}>
      <div className={theme.content}>
        { children }
        { goodKey }
      </div>
    </div>
  );
}
