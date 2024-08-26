// c 2024-07-24
// m 2024-07-24

void MedalWindow() {
    if (false
        || !S_MedalWindow
        || (S_MedalWindowHideWithGame && !UI::IsGameUIVisible())
        || (S_MedalWindowHideWithOP && !UI::IsOverlayShown())
        || !InMap()
    )
        return;

    const string uid = cast<CTrackMania@>(GetApp()).RootMap.EdChallengeId;
    bool hasMap = false;

    int flags = UI::WindowFlags::AlwaysAutoResize | UI::WindowFlags::NoTitleBar;
    if (!UI::IsOverlayShown())
        flags |= UI::WindowFlags::NoMove;

    if (UI::Begin(title + "-medal", S_MedalWindow, flags)) {
        if (maps.Exists(uid)) {
            PlayerMedals::Map@ map = cast<PlayerMedals::Map@>(maps[uid]);
            if (map !is null) {
                hasMap = true;
                const uint medaltime = map.custom > 0 ? map.custom : map.medaltime;
                const bool delta = S_MedalWindowDelta && map.pb != uint(-1);

                if (UI::BeginTable("##table-times", delta ? 4 : 3)) {
                    UI::TableNextRow();

                    UI::TableNextColumn();
                    UI::Image(icon32, vec2(scale * 16.0f));

                    UI::TableNextColumn();
                    UI::Text(S_PlayerName);

                    UI::TableNextColumn();
                    UI::Text(Time::Format(medaltime));

                    if (delta) {
                        UI::TableNextColumn();
                        UI::Text((map.pb <= medaltime ? "\\$77F\u2212" : "\\$F77+") + Time::Format(uint(Math::Abs(map.pb - medaltime))));
                    }

                    UI::EndTable();
                }
            }
        }

        if (S_ApiKey.Length > 0) {
            if (!hasMap) {
                UI::Text("Map not submitted.");
            }
            
            UI::Separator();

            UI::BeginDisabled(submitting);
            if (UI::Button(" Submit" + (submitting  ? "ing..." : "") + " PB")) {
                trace("submitting...");
                startnew(SubmitMapPB);
            }
            UI::EndDisabled();
        }
    }
    UI::End();
}
