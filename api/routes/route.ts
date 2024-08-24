import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

export class Route {
  static #defaultResponse = new Response("Not found", { status: 404 });
  static #errorResponse = new Response("Something unexpected occurred.", {
    status: 500,
  });

  static async defaultHandle(req: ApiRequest): Promise<ApiResponse> {
    req.logger.warn("Fellback to default handler.");
    return new ApiResponse(this.#defaultResponse, req);
  }
  static async errorHandle(req: ApiRequest): Promise<ApiResponse> {
    req.logger.error(
      "Unhandled error",
      req.error ?? new Error("No error, but in unhandled?")
    );
    return new ApiResponse(this.#errorResponse, req);
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    return Route.defaultHandle(req);
  }
}

export default Route;
