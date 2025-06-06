const bindEvent = (
  _target: Element | Window,
  name: string,
  fn: (args?: unknown) => void,
  options = false
) => {
  _target.addEventListener(name, fn, options);
  return () => {
    _target.removeEventListener(name, fn, options);
  };
};

export { bindEvent };
