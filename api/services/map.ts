import type { Db } from "./db";
import type { Map } from "../domain/map";

export class Maps {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async insert(map: Map) {
    return this.db.pool.query(
      `
        insert into Maps (MapUid, AuthorTime, Name, Campaign, CampaignIndex, TotdDate)
        values ($1, $2, $3, $4, $5, $6)
      `,
      [
        map.mapUid,
        map.authorTime,
        map.name,
        map.campaign,
        map.campaignIndex,
        map.totdDate,
      ]
    );
  }

  async update(map: Map) {
    return this.db.pool.query(
      `
        update Maps
        set AuthorTime=$2, Name=$3, Campaign=$4, CampaignIndex=$5, TotdDate=$6
        where MapUid=$1
      `,
      [
        map.mapUid,
        map.authorTime,
        map.name,
        map.campaign,
        map.campaignIndex,
        map.totdDate,
      ]
    );
  }

  async upsert(map: Map): Promise<Map> {
    try {
      await this.insert(map);
    } catch (error) {
      const result = await this.update(map);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return map;
  }
}

export default (db: Db) => new Maps(db);
