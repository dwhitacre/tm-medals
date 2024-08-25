import db from "./db";
import logger from "./logger";
import maps from "./map";

const services = { logger, db, maps: maps(db) };
export type Services = typeof services;
export default services;
