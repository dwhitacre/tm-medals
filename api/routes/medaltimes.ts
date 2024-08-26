import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import MedalTime from "../domain/medaltime";

class MedalTimes extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post"])) return ApiResponse.badRequest(req);
    if (req.method === "get") return this.handleGet(req);
    return this.handlePost(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const accountId = req.getQueryParam("accountId");
    if (!accountId) return ApiResponse.badRequest(req);

    const mapUid = req.getQueryParam("mapUid");
    const medalTimes = await req.services.medaltimes.get(accountId, mapUid);

    return ApiResponse.ok(req, { medalTimes, accountId, mapUid });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.unauthorized(req);

    const medalTime = await req.parse(MedalTime);
    if (!medalTime) return ApiResponse.badRequest(req);

    await req.services.medaltimes.upsert(medalTime);
    return ApiResponse.ok(req);
  }
}

export default new MedalTimes();
