import type { Services } from "../services";

export type ApiPermissions = {
  admin: boolean;
};

type Cache = {
  url?: URL;
  permissions?: ApiPermissions;
};

export class ApiRequest {
  raw: Request;
  services: Services;
  logger: Services["logger"];
  start: DOMHighResTimeStamp;
  error?: Error;

  #cache: Cache = {};

  constructor(req: Request, services: Services) {
    this.start = performance.now();
    this.raw = req;
    this.services = services;
    this.logger = this.services.logger.create();
    this.logger.set({
      from: "request",
      start: this.start,
      pathname: this.url.pathname,
    });
  }

  get url(): URL {
    return this.#cache.url ?? (this.#cache.url = new URL(this.raw.url));
  }

  get permissions(): ApiPermissions {
    if (this.#cache.permissions) return this.#cache.permissions;
    const admin = process.env.ADMIN_KEY
      ? this.raw.headers.get("x-tmmedals-adminkey") === process.env.ADMIN_KEY
      : false;
    return (this.#cache.permissions = { admin });
  }
}

export default ApiRequest;
