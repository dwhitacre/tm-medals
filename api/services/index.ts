import db from "./db";
import logger from "./logger";

const services = { logger, db };
export type Services = typeof services;
export default services;
