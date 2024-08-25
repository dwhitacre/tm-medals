export class Tmio {
  headers: Headers;

  constructor() {
    this.headers = new Headers();
    this.headers.append(
      "User-Agent",
      "tm-medals.danonthemoon.dev / danonthemoon@whitacre.dev"
    );
  }

  async get(pathname: string) {
    const response = await fetch(`${process.env.TMIO_URL}/${pathname}`, {
      headers: this.headers,
    });
    return response.json();
  }
}

export default new Tmio();
