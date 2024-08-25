import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Player from "../domain/player";

class Players extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("post")) return ApiResponse.badRequest(req);
    if (!req.checkPermission("admin")) return ApiResponse.unauthorized(req);

    const player = await req.parse(Player);
    if (!player) return ApiResponse.badRequest(req);

    await req.services.players.upsert(player);
    return ApiResponse.ok(req);
  }
}

export default new Players();
