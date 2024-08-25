import type { Services } from "../services";
import type ApiRequest from "./apirequest";

type Cache = {};

export class ApiResponse {
  raw: Response;
  req: ApiRequest;
  services: Services;
  logger: Services["logger"];
  end?: DOMHighResTimeStamp;

  #cache: Cache = {};

  constructor(res: Response, req: ApiRequest) {
    this.raw = res;
    this.req = req;
    this.services = req.services;
    this.logger = req.logger;
  }

  complete() {
    this.end = performance.now();
    this.logger.set({
      end: this.end,
      total: this.end - this.req.start,
      status: this.raw.status,
    });
    this.logger.info("Request finished.");
    return this.raw;
  }

  static badRequest(req: ApiRequest) {
    return new this(new Response("Bad Request", { status: 400 }), req);
  }

  static unauthorized(req: ApiRequest) {
    return new this(new Response("Unauthorized", { status: 401 }), req);
  }

  static ok(req: ApiRequest) {
    return new this(new Response("OK", { status: 200 }), req);
  }
}

export default ApiResponse;
