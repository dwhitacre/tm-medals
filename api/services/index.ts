import db from "./db";
import tmio from "./tmio";
import logger from "./logger";
import maps from "./map";
import medaltimes from "./medaltimes";
import players from "./players";

const services = {
  logger,
  db,
  tmio,
  maps: maps(db),
  players: players(db),
  medaltimes: medaltimes(db),
};
export type Services = typeof services;
export default services;
