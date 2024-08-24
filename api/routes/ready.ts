import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Ready extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    return new ApiResponse(new Response("OK", { status: 200 }), req);
  }
}

export default new Ready();
