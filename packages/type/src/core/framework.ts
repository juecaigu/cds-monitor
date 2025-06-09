type IAnyObject = Record<string, unknown>;

export interface VueInstance {
  config: VueConfiguration;
  version?: string;
}

export interface VueConfiguration {
  silent?: boolean;
  errorHandler?(err: Error, vm: ViewModel, info: string): void;
  warnHandler?(msg: string, vm: ViewModel, trace: string): void;
  keyCodes?: { [key: string]: number | Array<number> };
}

export interface ViewModel {
  [key: string]: unknown;
  $root?: Record<string, unknown>;
  $options?: {
    [key: string]: unknown;
    name?: string;
    propsData?: IAnyObject;
    _componentTag?: string;
    __file?: string;
    props?: IAnyObject;
  };
  $props?: IAnyObject;
}
