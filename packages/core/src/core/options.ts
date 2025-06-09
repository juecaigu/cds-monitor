import { InitOptions } from '@cds-monitor/type';
import { ifExist, typeofValue } from '@cds-monitor/utils';

type CommonType = boolean | string | number | Array<CommonType> | RegExp | object;

const OPTIONMAP: Record<
  string,
  {
    type: string;
    default: CommonType;
    required?: boolean;
  }
> = {
  apikey: { type: 'string', default: '', required: true },
  dsn: { type: 'string', default: '', required: true },
  throttleDelayTime: { type: 'number', default: 0 },
  overTime: { type: 'number', default: 10 },
  whiteBoxElements: {
    type: 'array',
    default: ['html', 'body', '#app', '#root'],
  },
  silentWhiteScreen: { type: 'boolean', default: false },
  skeletonProject: { type: 'boolean', default: false },
  filterXhrUrlRegExp: { type: 'regexp', default: new RegExp('') },
  handleHttpStatus: { type: 'string', default: '' },
  repeatCodeError: { type: 'boolean', default: false },
};

const checkOptionType = (type: string, optionValue: CommonType): boolean => {
  return typeofValue(optionValue) === type;
};

const checkOptionRequired = (options: InitOptions) => {
  for (const key in OPTIONMAP) {
    const value = OPTIONMAP[key];
    if (value.required && !options[key as keyof InitOptions]) {
      console.error(`${key} is required`);
      return;
    }
  }
};

class Options {
  apikey = '';
  userId = '';
  dsn = ''; // 监控上报接口的地址
  throttleDelayTime = 0; // click事件的节流时长
  overTime = 10; // 接口超时时长
  whiteBoxElements: string[] = ['html', 'body', '#app', '#root']; // 白屏检测的容器列表
  silentWhiteScreen = false; // 是否开启白屏检测
  skeletonProject = false; // 项目是否有骨架屏
  filterXhrUrlRegExp: RegExp = new RegExp(''); // 过滤的接口请求正则
  handleHttpStatus: unknown; // 处理接口返回的 response
  repeatCodeError = false; // 是否去除重复的代码错误，重复的错误只上报一次
  bindOptions(options: InitOptions) {
    if (checkOptionType(OPTIONMAP.apikey.type, options.apikey)) {
      this.apikey = options.apikey;
    }
    if (checkOptionType(OPTIONMAP.dsn.type, options.dsn)) {
      this.dsn = options.dsn;
    }
    if (
      ifExist(options.throttleDelayTime) &&
      checkOptionType(OPTIONMAP.throttleDelayTime.type, options.throttleDelayTime)
    ) {
      this.throttleDelayTime = options.throttleDelayTime;
    }
    if (ifExist(options.overTime) && checkOptionType(OPTIONMAP.overTime.type, options.overTime)) {
      this.overTime = options.overTime;
    }
    if (
      ifExist(options.whiteBoxElements) &&
      checkOptionType(OPTIONMAP.whiteBoxElements.type, options.whiteBoxElements)
    ) {
      this.whiteBoxElements = options.whiteBoxElements;
    }
    if (
      ifExist(options.silentWhiteScreen) &&
      checkOptionType(OPTIONMAP.silentWhiteScreen.type, options.silentWhiteScreen)
    ) {
      this.silentWhiteScreen = options.silentWhiteScreen;
    }
    if (
      ifExist(options.skeletonProject) &&
      checkOptionType(OPTIONMAP.skeletonProject.type, options.skeletonProject)
    ) {
      this.skeletonProject = options.skeletonProject;
    }
  }
}

const options = new Options();

const handleOptions = (paramOptions: InitOptions) => {
  checkOptionRequired(paramOptions);
  options.bindOptions(paramOptions);
};

export { options, handleOptions };
