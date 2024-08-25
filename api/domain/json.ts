export default class Json {
  static lowercaseKeys(json: { [_: string]: any }): { [_: string]: any } {
    return Object.fromEntries(
      Object.entries(json).map(([k, v]) => [k.toLowerCase(), v])
    );
  }

  static onlyPrefixedKeys(
    json: { [_: string]: any },
    prefix: string
  ): { [_: string]: any } {
    return Object.fromEntries(
      Object.entries(json)
        .filter(([k, v]) => k.startsWith(`${prefix}_`))
        .map(([k, v]) => [`${k.replace(`${prefix}_`, "")}`, v])
    );
  }
}
