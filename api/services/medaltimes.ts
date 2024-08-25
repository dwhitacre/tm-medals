import type { Db } from "./db";
import type { Player } from "../domain/player";
import MedalTime from "../domain/medaltime";

export class MedalTimes {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(accountId: Player["accountId"]): Promise<MedalTime | undefined> {
    const result = await this.db.pool.query(
      `
        select MedalTimes.*, Players.Name as Players_Name, Players.DateModified as Players_DateModified, Maps.AuthorTime, Maps.Name as Maps_Name, Maps.DateModified as Maps_DateModified from MedalTimes
        join Players on Players.AccountId = MedalTimes.AccountId
        join Maps on Maps.MapUid = MedalTimes.MapUid
        where MedalTimes.AccountId = $1
      `,
      [accountId]
    );
    if (result.rowCount == null || result.rowCount < 1) return undefined;
    if (result.rowCount > 1)
      throw Error(
        `Found MedalTimes when expected only one for accountId: ${accountId}`
      );

    const json = result.rows[0];
    return MedalTime.fromJson(json).hydrateMap(json).hydratePlayer(json);
  }

  async getAll(accountId: Player["accountId"]) {
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
    return result.rows.map(MedalTime.fromJson);
  }

  async insert(medalTime: MedalTime) {
    return this.db.pool.query(
      `
        insert into MedalTimes (MapUid, MedalTime, CustomMedalTime, Reason, AccountId)
        values ($1, $2, $3, $4, $5)
      `,
      [
        medalTime.mapUid,
        medalTime.medalTime,
        medalTime.customMedalTime,
        medalTime.reason,
        medalTime.accountId,
      ]
    );
  }

  async update(medalTime: MedalTime) {
    return this.db.pool.query(
      `
        update MedalTimes
        set MedalTime=$2, CustomMedalTime=$3, Reason=$4
        where AccountId=$1
      `,
      [
        medalTime.accountId,
        medalTime.medalTime,
        medalTime.customMedalTime,
        medalTime.reason,
      ]
    );
  }

  async upsert(medalTime: MedalTime): Promise<MedalTime> {
    try {
      await this.insert(medalTime);
    } catch (error) {
      const result = await this.update(medalTime);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return medalTime;
  }
}

export default (db: Db) => new MedalTimes(db);
