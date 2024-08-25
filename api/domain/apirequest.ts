import type { Services } from "../services";

export type ApiPermissions = "admin" | "read";
export type ApiMethods = "get" | "post" | "delete";

type Cache = {
  url?: URL;
  permissions?: Array<ApiPermissions>;
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

  get permissions(): Array<ApiPermissions> {
    if (this.#cache.permissions) return this.#cache.permissions;

    const permissions: Array<ApiPermissions> = ["read"];
    if (
      process.env.ADMIN_KEY &&
      this.raw.headers.get("x-api-key") === process.env.ADMIN_KEY
    )
      permissions.push("admin");

    return (this.#cache.permissions = permissions);
  }

  get method(): ApiMethods {
    return this.raw.method.toLowerCase() as ApiMethods;
  }

  getQueryParam(param: string): string | undefined {
    if (!this.url.searchParams.has(param)) return undefined;
    return this.url.searchParams.get(param) ?? undefined;
  }

  checkMethod(allowed: Array<ApiMethods> | ApiMethods = []): boolean {
    if (!(allowed instanceof Array)) allowed = [allowed];
    return allowed.includes(this.method);
  }

  checkPermission(required: ApiPermissions): boolean {
    return this.permissions.includes(required);
  }

  async parse<
    T extends {
      new (...args: Array<any>): any;
      fromJson: (json: { [_: string]: any }) => InstanceType<T>;
    }
  >(domain: T): Promise<InstanceType<T> | undefined> {
    if (typeof domain.fromJson !== "function") return undefined;

    let json;
    try {
      json = await this.raw.json();
      return domain.fromJson(json);
    } catch (error) {
      this.logger.warn("Failed to parse domain", { json, error });
      return undefined;
    }
  }
}

export default ApiRequest;
