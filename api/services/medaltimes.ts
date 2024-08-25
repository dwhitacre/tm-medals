import type { Db } from "./db";
import type { Map } from "./map";
import type { Player } from "./players";

export type MedalTime = {
  id: string;
  medalTime: number;
  customMedalTime?: number;
  reason?: string;
  dateModified?: Date;
} & Map &
  Player;

export class MedalTimes {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async allByPlayer(accountId: Player["accountId"]) {
    const result = await this.db.pool.query(
      `
        select * from MedalTimes
        join PlayerMedalTimes on PlayerMedalTimes.MedalTimesId = MedalTimes.Id
        join Players on Players.AccountId = PlayerMedalTimes.AccountId
        join Map on Map.MapUid = MedalTimes.MapUid
        where PlayerMedalTimes.AccountId = $1
      `,
      [accountId]
    );
    return result.rows.map((row) => console.log);
  }
}

export default (db: Db) => new MedalTimes(db);
