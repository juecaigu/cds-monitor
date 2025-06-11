import { BreadcrumbData, ReportData } from './base';
import { InitOptions } from './options';

export interface SdkPluginCore {
  send: (data: ReportData) => Promise<void>;
  getTime: () => number;
  breadcrumbs: BreadcrumbData[];
  options: InitOptions;
}

export abstract class Plugin {
  public type: string; // 插件类型
  constructor(type: string) {
    this.type = type;
  }
  abstract bindOptions(options: unknown): void; // 校验参数
  abstract core(sdkBase: SdkPluginCore): void; // 核心方法
}

export type PluginConstructor = new () => Plugin;
