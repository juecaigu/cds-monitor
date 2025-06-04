import { HandleEvent } from "./handleEvent";
import { replaceHalder } from "./replace";
import { EVENTTYPES } from "@cds-monitor/common";

export const setup = (): void => {
  // call setup replace some functions and properties
  replaceHalder({
    type: EVENTTYPES.WHITESCREEN,
    callback: () => {
      HandleEvent.whiteScreen();
    },
  });
};
