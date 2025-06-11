import { BREADCRUMBTYPES, EVENTTYPES, STATUS_CODE } from '@cds-monitor/common';

interface Support {
  hasError: boolean; // 某段时间代码是否报错
  events: string[]; // 存储录屏的信息
  recordScreenId: string; // 本次录屏的id
  _loopTimer: number; // 白屏循环检测的timer
  deviceInfo: Record<string, string | undefined>;
}

interface Callback {
  (...args: unknown[]): unknown;
}

interface ReplaceHandler {
  type: EVENTTYPES;
  callback: Callback;
}

type ReplaceCallback = (data?: unknown) => void;

interface ErrorTarget {
  target?: {
    localName?: string;
  };
  error?: unknown;
  message?: string;
}

export interface StackFrames {
  filename: string;
  functionName: string;
  colno?: number;
  lineno?: number;
}

export interface BreadcrumbData {
  type: EVENTTYPES;
  category: BREADCRUMBTYPES;
  status: STATUS_CODE;
  time: number;
  data?: unknown;
}

// 加载资源报错
export interface LoadSourceErrorTarget {
  localName?: string;
  url?: string;
  outerHTML?: string;
  time?: number;
  message?: string;
}

export interface JSError {
  filename?: string;
  stack?: StackFrames[];
  message?: string;
  time?: number;
  lineno?: number;
  colno?: number;
  meta?: {
    hook?: string;
    componentName?: string;
  };
}

interface RouteHistory {
  from: string;
  to: string;
}

export interface ReportData<T = unknown> {
  type: EVENTTYPES;
  reportInfo: LoadSourceErrorTarget | JSError | RouteHistory | T;
  userId?: string;
  pageUrl?: string;
  time?: number;
  apiKey?: string;
  sdkVersion?: string;
  uuid?: string;
  deviceInfo?: {
    browserVersion: string | number; // 版本号
    browser: string; // Chrome
    osVersion: string | number; // 电脑系统 10
    os: string; // 设备系统
  };
  breadcrumbs?: BreadcrumbData[];
  status?: STATUS_CODE;
}

export { Support, Callback, ReplaceHandler, ReplaceCallback, ErrorTarget, RouteHistory };
