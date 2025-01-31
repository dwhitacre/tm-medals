import { afterAll, beforeAll, expect, test } from "bun:test";
import { apikeyCreate, playerCreate } from "./api";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";

let pool: Pool;

beforeAll(() => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
});

afterAll(async () => {
  await pool.end();
});

test("returns 200", async () => {
  const response = await fetch("http://localhost:8081/me");
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeUndefined();
});

test("returns 200 when bad apikey", async () => {
  const accountId = faker.string.uuid();
  await playerCreate({
    accountId,
  });

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const response = await fetch(`http://localhost:8081/me?api-key=garbage`);
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeUndefined();
});

test("returns 200 and me with query param", async () => {
  const accountId = faker.string.uuid();
  await playerCreate({
    accountId,
  });

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const response = await fetch(`http://localhost:8081/me?api-key=${apikey}`);
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me.accountId).toEqual(accountId);
});

test("returns 200 and me with header", async () => {
  const accountId = faker.string.uuid();
  await playerCreate({
    accountId,
  });

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const response = await fetch(`http://localhost:8081/me`, {
    headers: {
      "x-api-key": apikey,
    },
  });
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me.accountId).toEqual(accountId);
});
