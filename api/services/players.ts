import type { Db } from "./db";

export type Player = {
  accountId: string;
  name: string;
  dateModified?: Date;
};

export class Players {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  fromJson(json: Awaited<ReturnType<Request["json"]>>): Player | undefined {
    if (!json?.accountId) return undefined;
    if (!json.name) return undefined;

    const player: Player = {
      accountId: json.accountId,
      name: json.name,
    };
    return player;
  }

  async insert(player: Player) {
    return this.db.pool.query(
      `
        insert into Player (AccountId, Name)
        values ($1, $2)
      `,
      [player.accountId, player.name]
    );
  }

  async update(player: Player) {
    return this.db.pool.query(
      `
        update Player
        set Name=$2
        where AccountId=$1
      `,
      [player.accountId, player.name]
    );
  }

  async upsert(player: Player): Promise<Player> {
    try {
      await this.insert(player);
    } catch (error) {
      await this.update(player);
    }
    return player;
  }
}

export default (db: Db) => new Players(db);
