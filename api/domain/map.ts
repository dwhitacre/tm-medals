import Json from "./json";

export class Map {
  mapUid: string;
  authorTime: number;
  name: string;
  campaign?: string;
  campaignIndex?: number;
  totdDate?: string;
  dateModified?: Date;
  nadeo = false;

  static fromJson(json: { [_: string]: any }): Map {
    json = Json.lowercaseKeys(json);

    if (!json?.mapuid) throw new Error("Failed to get mapUid");
    if (!json.authortime) throw new Error("Failed to get authorTime");
    if (!json.name) throw new Error("Failed to get name");

    const map = new this(json.mapuid, json.authortime, json.name);
    if (json.campaign) map.campaign = json.campaign;
    if (json.campaignindex) map.campaignIndex = json.campaignindex;
    if (json.totddate) map.totdDate = json.totddate;
    if (json.datemodified) map.dateModified = json.datemodified;
    if (json.nadeo) map.nadeo = json.nadeo;

    return map;
  }

  constructor(mapUid: string, authorTime: number, name: string) {
    this.mapUid = mapUid;
    this.authorTime = authorTime;
    this.name = name;
  }
}

export default Map;
