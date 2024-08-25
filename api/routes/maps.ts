import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Maps extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (req.raw.method.toLowerCase() !== "post")
      return ApiResponse.badRequest(req);

    if (!req.permissions.admin) return ApiResponse.unauthorized(req);

    const json = await req.raw.json();
    const map = req.services.maps.fromJson(json);
    if (!map) {
      req.logger.warn("Failed to parse map", { map, json });
      return ApiResponse.badRequest(req);
    }

    await req.services.maps.upsertMap(map);
    return ApiResponse.ok(req);
  }
}

export default new Maps();
