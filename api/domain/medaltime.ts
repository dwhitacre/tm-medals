import Map from "./map";
import type Player from "./player";
import Json from "./json";

export class MedalTime {
  mapUid: string;
  medalTime: number;
  customMedalTime = -1;
  reason = "";
  dateModified?: Date;
  accountId: string;

  map?: Map;
  player?: Player;

  static fromJson(json: { [_: string]: any }): MedalTime {
    json = Json.lowercaseKeys(json);

    if (!json?.mapuid) throw new Error("Failed to get mapUid");
    if (!json.medaltime) throw new Error("Failed to get medalTime");
    if (!json.accountid) throw new Error("Failed to get accountId");

    const medalTimes = new this(json.mapuid, json.medaltime, json.accountid);
    if (json.custommedaltime) medalTimes.customMedalTime = json.custommedaltime;
    if (json.reason) medalTimes.reason = json.reason;
    if (json.datemodified) medalTimes.dateModified = json.datemodified;

    return medalTimes;
  }

  constructor(
    mapUid: string,
    medalTime: number,
    accountId: Player["accountId"]
  ) {
    this.mapUid = mapUid;
    this.medalTime = medalTime;
    this.accountId = accountId;
  }
}

export default MedalTime;
