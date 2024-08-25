import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class MedalTimes extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.url.searchParams.has("accountId"))
      return ApiResponse.badRequest(req);

    const medaltimes = await req.services.medaltimes.allByPlayer(
      `${req.url.searchParams.get("accountId")}`
    );
    return ApiResponse.ok(req, { medaltimes });
  }
}

export default new MedalTimes();
