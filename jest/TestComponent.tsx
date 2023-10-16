import { type ThemeT } from '../src';

type ComponentPropsT = {
  children?: React.ReactNode;
  theme: ThemeT, // container, content
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

/* Can't type themes right now.
Component.propTypes = {
  children: PT.node,
  theme: PT.shape({
    container: PT.string,
    content: PT.string,
  }).isRequired,
};
*/

Component.defaultProps = {
  children: null,
};
