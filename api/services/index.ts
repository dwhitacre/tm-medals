import type { Logger } from "./logger";
import logger from "./logger";

export type Services = { logger: Logger };
export default { logger } as Services;
