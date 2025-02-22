void Main() {
    startnew(Services::StartReadyHealthCheck);
    startnew(Services::LoadServices);
    // startnew(PBLoop);

    // bool inMap = InMap();
    // bool wasInMap = false;

    // while (true) {
    //     yield();

    //     inMap = InMap();

    //     if (wasInMap != inMap) {
    //         wasInMap = inMap;

    //         if (inMap)
    //             GetMapInfoAsync();
    //     }
    // }
}

void Render() {
    View::Main.Render();
    View::Medal.Render();
}

void RenderEarly() {
    View::RenderUIMedals();
}

void RenderMenu() {
    View::Menu.Render();
}

// void PBLoop() {
//     while (true) {
//         sleep(500);

//         CTrackMania@ App = cast<CTrackMania@>(GetApp());
//         if (App.RootMap is null || !maps.Exists(App.RootMap.EdChallengeId))
//             continue;

//         PlayerMedals::Map@ map = cast<PlayerMedals::Map@>(maps[App.RootMap.EdChallengeId]);
//         if (map !is null) {
//             const uint prevPb = map.pb;

//             map.GetPBAsync();

//             if (prevPb != map.pb)
//                 SetTotals();
//         }
//     }
// }
