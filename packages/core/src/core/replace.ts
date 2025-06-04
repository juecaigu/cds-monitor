import { EVENTTYPES } from "@cds-monitor/common";
import { ReplaceHandler } from "@cds-monitor/type";
import subscribe from "./subscribe";

const whiteScreen = () => {
  subscribe.notify(EVENTTYPES.WHITESCREEN);
};

const replace = (type: EVENTTYPES): void => {
  switch (type) {
    case EVENTTYPES.WHITESCREEN:
      whiteScreen();
      break;
    default:
      break;
  }
};

const replaceHalder = (handler: ReplaceHandler): void => {
  if (!subscribe.subscribe(handler)) return;
  replace(handler.type);
};

export { replaceHalder };
