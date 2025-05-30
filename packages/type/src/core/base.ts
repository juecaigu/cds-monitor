export interface Support {
  hasError: boolean; // 某段时间代码是否报错
  events: string[]; // 存储录屏的信息
  recordScreenId: string; // 本次录屏的id
  _loopTimer: number; // 白屏循环检测的timer
  deviceInfo: Record<string, string | undefined>;
}
