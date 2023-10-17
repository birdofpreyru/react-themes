// This is a component accepting legacy themes (Themr library).

export type ComponentThemeT = {
  container?: string;
  content?: string;
};

type ComponentPropsT = {
  children?: React.ReactNode;
  theme: ComponentThemeT;
};

export default function Component({ children, theme }: ComponentPropsT) {
  return (
    <div className={theme.container}>
      <div className={theme.content}>
        { children }
      </div>
    </div>
  );
}

Component.defaultProps = {
  children: null,
};
