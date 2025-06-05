import { options } from "./options";
import { whiteScreen } from "./whiteScreen";

const HandleEvent = {
  whiteScreen() {
    whiteScreen(() => {
      // report whiteScreen error
    }, options);
  },
};

export { HandleEvent };
