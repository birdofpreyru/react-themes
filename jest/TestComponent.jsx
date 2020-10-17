import PT from 'prop-types';

export default function Component({ children, theme }) {
  return (
    <div className={theme.container}>
      <div className={theme.content}>
        { children }
      </div>
    </div>
  );
}

Component.propTypes = {
  children: PT.node,
  theme: PT.shape({
    container: PT.string,
    content: PT.string,
  }).isRequired,
};

Component.defaultProps = {
  children: null,
};
