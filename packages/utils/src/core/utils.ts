import { Callback } from '@cds-monitor/type';
import { ifExist } from './validate';

const bindEvent = (
  _target: Element | Window,
  name: string,
  fn: (args?: Event) => void,
  options = false,
) => {
  _target.addEventListener(name, fn, options);
  return () => {
    _target.removeEventListener(name, fn, options);
  };
};

const generateUUID = (): string => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const getLocationHref = (): string => {
  if (typeof document === 'undefined' || document.location == null) return '';
  return document.location.href;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replaceAop = (target: any, name: string, replacement: Callback) => {
  if (!ifExist(origin)) {
    return;
  }
  if (name in target) {
    const origin = target[name];
    const wrapped = replacement(origin);
    if (typeof wrapped === 'function') {
      target[name] = wrapped;
    }
  }
};

export { bindEvent, generateUUID, getLocationHref, replaceAop };
