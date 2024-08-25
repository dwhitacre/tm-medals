import type { Services } from "../services";
import type ApiRequest from "./apirequest";

type Cache = {};
export type ApiProperties = {
  [_: string]: unknown;
};

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

  static newResponse(
    message: string,
    status: number,
    props: ApiProperties = {}
  ) {
    return new Response(JSON.stringify({ message, status, ...props }), {
      status,
    });
  }

  static badRequest(req: ApiRequest) {
    return new this(this.newResponse("Bad Request", 400), req);
  }

  static unauthorized(req: ApiRequest) {
    return new this(this.newResponse("Unauthorized", 401), req);
  }

  static ok(req: ApiRequest, properties?: ApiProperties) {
    return new this(this.newResponse("Ok", 200, properties), req);
  }
}

export default ApiResponse;
