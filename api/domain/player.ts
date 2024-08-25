import Json from "./json";

export class Player {
  accountId: string;
  name: string;
  dateModified?: Date;

  static fromJson(json: { [_: string]: any }): Player {
    json = Json.lowercaseKeys(json);

    if (!json?.accountid) throw new Error("Failed to get accountId");
    if (!json.name) throw new Error("Failed to get name");

    const player = new this(json.accountid, json.name);
    if (json.datemodified) player.dateModified = json.datemodified;

    return player;
  }

  constructor(accountId: string, name: string) {
    this.accountId = accountId;
    this.name = name;
  }
}

export default Player;
