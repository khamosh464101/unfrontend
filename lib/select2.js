const ClearIndicator = (props) => {
  const {
    children = (
      <i className="ri-close-line me-1 font-semibold align-middle text-gray-500 hover:text-gray-700" />
    ), // Custom icon
    getStyles,
    innerRef,
    innerProps,
  } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={getStyles("clearIndicator", props)}
    >
      {children}
    </div>
  );
};

export default ClearIndicator;
