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

    await req.services.maps.upsert(map);
    return ApiResponse.ok(req);
  }
}

export default new Maps();
