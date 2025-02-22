void Main() {
    startnew(Services::StartReadyHealthCheck);
    startnew(Services::LoadServices);
    startnew(Services::StartPBLoop);

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
