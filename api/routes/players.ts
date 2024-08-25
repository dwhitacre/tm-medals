import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Players extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (req.raw.method.toLowerCase() !== "post")
      return ApiResponse.badRequest(req);

    if (!req.permissions.admin) return ApiResponse.unauthorized(req);

    const json = await req.raw.json();
    const player = req.services.players.fromJson(json);
    if (!player) {
      req.logger.warn("Failed to parse player", { player, json });
      return ApiResponse.badRequest(req);
    }

    await req.services.players.upsert(player);
    return ApiResponse.ok(req);
  }
}

export default new Players();
