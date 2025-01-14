import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Map from "../domain/map";

class Maps extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("post")) return ApiResponse.badRequest(req);
    if (!req.checkPermission("admin")) return ApiResponse.unauthorized(req);

    const map = await req.parse(Map);
    if (!map) return ApiResponse.badRequest(req);

    const existingMap = await req.services.maps.get(map);
    if (existingMap) {
      map.campaign = map.campaign ?? existingMap.campaign;
      map.campaignIndex = map.campaignIndex ?? existingMap.campaignIndex;
      map.totdDate = map.totdDate ?? existingMap.totdDate;
      map.nadeo = map.nadeo ?? existingMap.nadeo;
    }

    await req.services.maps.upsert(map);
    return ApiResponse.ok(req);
  }
}

export default new Maps();
