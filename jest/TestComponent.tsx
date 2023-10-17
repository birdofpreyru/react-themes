import { type ThemeT } from '../src';

export type ComponentThemeT = ThemeT & {
  container?: string;
  content?: string;
};

type ComponentPropsT = {
  children?: React.ReactNode;
  theme: ComponentThemeT;
  goodKey?: string;
};

export default function Component({
  children,
  goodKey,
  theme,
}: ComponentPropsT) {
  return (
    <div className={theme.container}>
      <div className={theme.content}>
        { children }
        { goodKey }
      </div>
    </div>
  );
}

Component.defaultProps = {
  children: null,
  goodKey: '',
};
