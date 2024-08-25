import type { Db } from "./db";
import type { Player } from "../domain/player";

export class Players {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async insert(player: Player) {
    return this.db.pool.query(
      `
        insert into Players (AccountId, Name)
        values ($1, $2)
      `,
      [player.accountId, player.name]
    );
  }

  async update(player: Player) {
    return this.db.pool.query(
      `
        update Players
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
      const result = await this.update(player);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return player;
  }
}

export default (db: Db) => new Players(db);
