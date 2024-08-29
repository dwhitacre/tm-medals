// c 2024-07-18
// m 2024-07-23

bool         getting        = false;
dictionary@  missing        = dictionary();
bool submitting = false;

void GetAllMapInfosAsync() {
    startnew(TryGetCampaignIndicesAsync);

    getting = true;

    const uint64 start = Time::Now;
    trace("getting all map infos");

    Net::HttpRequest@ req = Net::HttpGet(S_ApiUrl + "/medaltimes?accountId=" + S_PlayerAccountId);
    while (!req.Finished())
        yield();

    const int respCode = req.ResponseCode();
    if (respCode != 200) {
        error("getting all map infos failed after " + (Time::Now - start) + "ms: code: " + respCode + " | msg: " + req.String().Replace("\n", " "));
        getting = false;
        return;
    }

    Json::Value@ data = req.Json()["medalTimes"];
    if (!PlayerMedals::CheckJsonType(data, Json::Type::Array, "data")) {
        error("getting all map infos failed after " + (Time::Now - start) + "ms");
        getting = false;
        return;
    }

    yield();

    for (uint i = 0; i < data.Length; i++) {
        PlayerMedals::Map@ map = PlayerMedals::Map(data[i]);
        maps[data[i]["mapUid"]] = @map;
    }

    trace("getting all map infos done after " + (Time::Now - start) + "ms");
    getting = false;

    GetAllPBsAsync();
    BuildCampaigns();
}

bool GetCampaignIndicesAsync() {
    const uint64 start = Time::Now;
    trace("getting campaign indices");

    Net::HttpRequest@ req = Net::HttpGet(S_ApiUrl + "/campaign-indices");
    while (!req.Finished())
        yield();

    const int respCode = req.ResponseCode();
    if (respCode != 200) {
        error("getting campaign indices failed after " + (Time::Now - start) + "ms: code: " + respCode + " | msg: " + req.String().Replace("\n", " "));
        return false;
    }

    @campaignIndices = req.Json()["campaignIndices"];

    if (!PlayerMedals::CheckJsonType(campaignIndices, Json::Type::Object, "campaignIndices", false)) {
        error("getting campaign indices failed after " + (Time::Now - start) + "ms");
        return false;
    }

    trace("getting campaign indices done after " + (Time::Now - start) + "ms");
    return true;
}

void GetMapInfoAsync() {
    CTrackMania@ App = cast<CTrackMania@>(GetApp());

    if (App.RootMap is null)
        return;

    GetMapInfoAsync(App.RootMap.EdChallengeId);
}

void GetMapInfoAsync(const string &in uid) {
    if (maps.Exists(uid))
        return;

    while (getting)
        yield();

    if (missing.Exists(uid)) {
        if (Time::Stamp < int64(missing[uid]))
            return;

        missing.Delete(uid);
    }

    if (maps.Exists(uid))
        return;

    getting = true;

    const uint64 start = Time::Now;
    trace("getting map info for " + uid);

    Net::HttpRequest@ req = Net::HttpGet(S_ApiUrl + "/medaltimes?mapUid=" + uid + "&accountId=" + S_PlayerAccountId);
    while (!req.Finished())
        yield();

    const int respCode = req.ResponseCode();
    switch (respCode) {
        case 200:
            break;
        case 429:
            error("getting map info for " + uid + " failed after " + (Time::Now - start) + "ms: too many requests");
            getting = false;
            return;
        default:
            error("getting map info for " + uid + " failed after " + (Time::Now - start) + "ms: code: " + respCode + " | msg: " + req.String().Replace("\n", " "));
            getting = false;
            return;
    }

    Json::Value@ mapInfo = req.Json()["medalTimes"];
    if (PlayerMedals::CheckJsonType(mapInfo, Json::Type::Array, "mapInfo") && mapInfo.Length > 0) {
        PlayerMedals::Map@ map = PlayerMedals::Map(mapInfo[0]);
        map.GetPB();
        maps[uid] = @map;

        trace("getting map info for " + uid + " done after " + (Time::Now - start) + "ms");
    } else {
        warn("map info not found for " + uid + " after " + (Time::Now - start) + "ms");
        missing[uid] = Time::Stamp + 600;  // wait 10 minutes to check map again
    }

    getting = false;
}

void TryGetCampaignIndicesAsync() {
    while (true) {
        if (GetCampaignIndicesAsync())
            break;

        sleep(5000);
    }

    for (uint i = 0; i < campaignsArr.Length; i++) {
        Campaign@ campaign = campaignsArr[i];
        if (campaign is null || campaign.type != PlayerMedals::CampaignType::Other)
            continue;

        campaign.SetOtherCampaignIndex();
    }

    SortCampaigns();
}

void SubmitMapPB() {
    submitting = true;

    const uint64 start = Time::Now;
    trace("submitting map pb");

    CTrackMania@ App = cast<CTrackMania@>(GetApp());

    if (App.RootMap is null) {
        error("submitting map pb failed after " + (Time::Now - start) + "ms: no map found");
        submitting = false;
        return;
    }

    if (false
        || App.MenuManager is null
        || App.MenuManager.MenuCustom_CurrentManiaApp is null
        || App.MenuManager.MenuCustom_CurrentManiaApp.ScoreMgr is null
        || App.UserManagerScript is null
        || App.UserManagerScript.Users.Length == 0
        || App.UserManagerScript.Users[0] is null
    ) {
        error("submitting map pb failed after " + (Time::Now - start) + "ms: no pb found");
        submitting = false;
        return;
    }

    auto currentMapInfo = MapInfo::GetCurrentMapInfo();
    const string uid = App.RootMap.EdChallengeId;
    const string mapName = currentMapInfo.CleanName;
    const uint author = App.RootMap.TMObjective_AuthorTime;
    const string accountId = App.MenuManager.MenuCustom_CurrentManiaApp.LocalUser.WebServicesUserId;
    const string displayName = App.MenuManager.MenuCustom_CurrentManiaApp.LocalUser.Name;
    const uint pb = App.MenuManager.MenuCustom_CurrentManiaApp.ScoreMgr.Map_GetRecord_v2(App.UserManagerScript.Users[0].Id, uid, "PersonalBest", "", "TimeAttack", "");
    const bool nadeo = currentMapInfo.AuthorAccountId == S_NadeoAccountId;

    if (pb > 2147483647) {
        error("submitting map pb failed after " + (Time::Now - start) + "ms: pb is not set or too large");
        submitting = false;
        return;
    }

    Json::Value mapData = Json::Object();
    mapData["mapUid"] = uid;
    mapData["authorTime"] = author;
    mapData["name"] = mapName;
    mapData["nadeo"] = nadeo;
    if (currentMapInfo.LoadedWasTOTD && currentMapInfo.TOTDDate.Length > 0) {
        mapData["totdDate"] = currentMapInfo.TOTDDate.Split(" ")[0];
    }

    Net::HttpRequest@ req = Net::HttpPost(S_ApiUrl + "/maps?api-key=" + S_ApiKey, Json::Write(mapData), "application/json");
    while (!req.Finished())
        yield();

    int respCode = req.ResponseCode();
    if (respCode != 200) {
        error("submitting map pb failed on map upsert after " + (Time::Now - start) + "ms: code: " + respCode + " | msg: " + req.String().Replace("\n", " "));
        submitting = false;
        return;
    }

    Json::Value playerData = Json::Object();
    playerData["accountId"] = accountId;
    playerData["name"] = displayName;

    Net::HttpRequest@ req3 = Net::HttpPost(S_ApiUrl + "/players?api-key=" + S_ApiKey, Json::Write(playerData), "application/json");
    while (!req3.Finished())
        yield();

    respCode = req3.ResponseCode();
    if (respCode != 200) {
        error("submitting map pb failed on player upsert after " + (Time::Now - start) + "ms: code: " + respCode + " | msg: " + req3.String().Replace("\n", " "));
        submitting = false;
        return;
    }

    Json::Value medalTimeData = Json::Object();
    medalTimeData["mapUid"] = uid;
    medalTimeData["medalTime"] = pb;
    medalTimeData["accountId"] = accountId;

    Net::HttpRequest@ req2 = Net::HttpPost(S_ApiUrl + "/medaltimes?api-key=" + S_ApiKey, Json::Write(medalTimeData), "application/json");
    while (!req2.Finished())
        yield();

    respCode = req2.ResponseCode();
    if (respCode != 200) {
        error("submitting map pb failed on medaltime upsert after " + (Time::Now - start) + "ms: code: " + respCode + " | msg: " + req2.String().Replace("\n", " "));
        submitting = false;
        return;
    }

    trace("submitting map pb done after " + (Time::Now - start) + "ms");
    submitting = false;

    trace("reloading map infos");
    startnew(GetAllMapInfosAsync);
}
