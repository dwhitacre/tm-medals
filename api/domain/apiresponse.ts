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
}

export default ApiResponse;
