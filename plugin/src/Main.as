// c 2024-07-17
// m 2024-07-30

Campaign@     activeOtherCampaign;
Campaign@     activeSeasonalCampaign;
Campaign@     activeTotdMonth;
Json::Value@  campaignIndices;
dictionary@   campaigns         = dictionary();
Campaign@[]   campaignsArr;
const string  colorStr          = "\\$3F3";
const vec3    colorVec          = vec3(0.2f, 0.8f, 1.0f);
UI::Font@     fontHeader;
UI::Font@     fontSubHeader;
bool          hasPlayPermission = false;
nvg::Texture@ iconUI;
UI::Texture@  icon32;
UI::Texture@  icon512;
bool          loading           = false;
dictionary@   maps              = dictionary();
const float   scale             = UI::GetScale();
vec3[]        seasonColors;
bool          settingTotals     = false;
const string  title             = colorStr + Icons::Circle + "\\$G " + S_PlayerName + " Medals";
uint          total             = 0;
uint          totalHave         = 0;

void Main() {
    OnSettingsChanged();
    startnew(GetAllMapInfosAsync);
    PlayerMedals::GetIcon32();
    hasPlayPermission = Permissions::PlayLocalMap();

    yield();

    IO::FileSource file("src/assets/players/" + S_PlayerAccountId + "_512.png");
    @iconUI = nvg::LoadTexture(file.Read(file.Size()));

    yield();

    @fontSubHeader = UI::LoadFont("DroidSans.ttf", 20);
    @fontHeader    = UI::LoadFont("DroidSans.ttf", 26);

    startnew(PBLoop);

    bool inMap = InMap();
    bool wasInMap = false;

    while (true) {
        yield();

        inMap = InMap();

        if (wasInMap != inMap) {
            wasInMap = inMap;

            if (inMap)
                GetMapInfoAsync();
        }
    }
}

void OnSettingsChanged() {
    seasonColors = {
        S_ColorWinter,
        S_ColorSpring,
        S_ColorSummer,
        S_ColorFall
    };
}

void Render() {
    if (icon32 is null)
        return;

    MainWindow();
    MedalWindow();
}

void RenderEarly() {
    DrawOverUI();
}

void RenderMenu() {
    if (UI::BeginMenu(title)) {
        if (UI::MenuItem(colorStr + Icons::WindowMaximize + "\\$G Main window", "", S_MainWindow))
            S_MainWindow = !S_MainWindow;

        if (UI::MenuItem(colorStr + Icons::Circle + "\\$G Medal window", "", S_MedalWindow))
            S_MedalWindow = !S_MedalWindow;

        UI::EndMenu();
    }
}

void PBLoop() {
    while (true) {
        sleep(500);

        CTrackMania@ App = cast<CTrackMania@>(GetApp());
        if (App.RootMap is null || !maps.Exists(App.RootMap.EdChallengeId))
            continue;

        PlayerMedals::Map@ map = cast<PlayerMedals::Map@>(maps[App.RootMap.EdChallengeId]);
        if (map !is null) {
            const uint prevPb = map.pb;

            map.GetPBAsync();

            if (prevPb != map.pb)
                SetTotals();
        }
    }
}

void SetTotals() {
    if (settingTotals)
        return;

    settingTotals = true;

    const uint64 start = Time::Now;
    trace("setting totals");

    total = maps.GetKeys().Length;
    totalHave = 0;

    for (uint i = 0; i < campaignsArr.Length; i++) {
        Campaign@ campaign = campaignsArr[i];
        if (campaign !is null)
            totalHave += campaign.count;
    }

    trace("setting totals done after " + (Time::Now - start) + "ms");
    settingTotals = false;
}
