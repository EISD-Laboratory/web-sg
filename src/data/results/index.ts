export { type Division, type StudentResult } from "./types";
export { UIUX_RESULTS } from "./uiux";
export { TECHNOPRENEUR_RESULTS } from "./technopreneur";
export { SOFTDEV_RESULTS } from "./softdev";
export { IS_RESULTS } from "./intelligence-system";

import { UIUX_RESULTS } from "./uiux";
import { TECHNOPRENEUR_RESULTS } from "./technopreneur";
import { SOFTDEV_RESULTS } from "./softdev";
import { IS_RESULTS } from "./intelligence-system";
import { StudentResult } from "./types";

export const RESULTS: StudentResult[] = [
  ...UIUX_RESULTS,
  ...TECHNOPRENEUR_RESULTS,
  ...SOFTDEV_RESULTS,
  ...IS_RESULTS,
];

export const WA_LINKS = {
  general: "https://chat.whatsapp.com/I27K1FbCUD1EbeVZbAlg3D?mode=gi_t",
};
