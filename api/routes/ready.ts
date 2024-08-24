import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Ready extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    await req.services.db.pool.query("SELECT 1=1");
    return new ApiResponse(new Response("OK", { status: 200 }), req);
  }
}

export default new Ready();
