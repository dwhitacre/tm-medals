import type { Db } from "./db";

export type Map = {
  mapUid: string;
  authorTime: number;
  name: string;
  campaign?: string;
  campaingIndex?: number;
  dateModified?: Date;
};

export class Maps {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  fromJson(json: Awaited<ReturnType<Request["json"]>>): Map | undefined {
    if (!json?.mapUid) return undefined;
    if (!json.authorTime) return undefined;
    if (!json.name) return undefined;

    const map: Map = {
      mapUid: json.mapUid,
      authorTime: json.authorTime,
      name: json.name,
      campaign: json.campaign ?? "",
      campaingIndex: json.campaingIndex ?? -1,
    };
    return map;
  }

  async insert(map: Map) {
    return this.db.pool.query(
      `
        insert into Map (MapUid, AuthorTime, Name, Campaign, CampaignIndex)
        values ($1, $2, $3, $4, $5)
      `,
      [
        map.mapUid,
        map.authorTime,
        map.name,
        map.campaign ?? "",
        map.campaingIndex ?? -1,
      ]
    );
  }

  async update(map: Map) {
    return this.db.pool.query(
      `
        update Map
        set AuthorTime=$2, Name=$3, Campaign=$4, CampaignIndex=$5
        where MapUid=$1
      `,
      [
        map.mapUid,
        map.authorTime,
        map.name,
        map.campaign ?? "",
        map.campaingIndex ?? -1,
      ]
    );
  }

  async upsert(map: Map): Promise<Map> {
    try {
      await this.insert(map);
    } catch (error) {
      await this.update(map);
    }
    return map;
  }
}

export default (db: Db) => new Maps(db);
