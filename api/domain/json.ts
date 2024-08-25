export default class Json {
  static lowercaseKeys(json: { [_: string]: any }): { [_: string]: any } {
    return Object.fromEntries(
      Object.entries(json).map(([k, v]) => [k.toLowerCase(), v])
    );
  }
}
